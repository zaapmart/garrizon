package com.garrizon.service;

import com.garrizon.dto.AddToCartRequest;
import com.garrizon.dto.CartDTO;
import com.garrizon.dto.CartItemDTO;
import com.garrizon.exception.ResourceNotFoundException;
import com.garrizon.model.Cart;
import com.garrizon.model.CartItem;
import com.garrizon.model.Product;
import com.garrizon.model.User;
import com.garrizon.repository.CartItemRepository;
import com.garrizon.repository.CartRepository;
import com.garrizon.repository.ProductRepository;
import com.garrizon.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartDTO getCart(UserDetails userDetails) {
        User user = getUser(userDetails);
        Cart cart = getOrCreateCart(user);
        return mapToDTO(cart);
    }

    @Transactional
    public CartDTO addToCart(UserDetails userDetails, AddToCartRequest request) {
        User user = getUser(userDetails);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Optional<CartItem> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setPrice(product.getPrice()); // Update price to current
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .price(product.getPrice())
                    .build();
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        return mapToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO updateCartItemQuantity(UserDetails userDetails, Long cartItemId, Integer quantity) {
        User user = getUser(userDetails);
        Cart cart = getOrCreateCart(user);
        
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Item does not belong to user's cart");
        }

        if (quantity <= 0) {
            cart.removeItem(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return mapToDTO(cartRepository.save(cart));
    }

    @Transactional
    public CartDTO removeCartItem(UserDetails userDetails, Long cartItemId) {
        User user = getUser(userDetails);
        Cart cart = getOrCreateCart(user);
        
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        
        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("Item does not belong to user's cart");
        }

        cart.removeItem(item);
        cartItemRepository.delete(item);

        return mapToDTO(cartRepository.save(cart));
    }

    @Transactional
    public void clearCart(UserDetails userDetails) {
        User user = getUser(userDetails);
        Cart cart = getOrCreateCart(user);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }

    private User getUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .cartItems(new ArrayList<>())
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    private CartDTO mapToDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getCartItems().stream()
                .map(this::mapItemToDTO)
                .collect(Collectors.toList());

        BigDecimal totalAmount = itemDTOs.stream()
                .map(CartItemDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDTO.builder()
                .id(cart.getId())
                .items(itemDTOs)
                .totalAmount(totalAmount)
                .build();
    }

    private CartItemDTO mapItemToDTO(CartItem item) {
        return CartItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productSlug(item.getProduct().getSlug())
                .productImageUrl(item.getProduct().getImageUrl())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .build();
    }
}
