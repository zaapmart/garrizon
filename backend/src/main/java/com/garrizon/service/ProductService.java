package com.garrizon.service;

import com.garrizon.dto.ProductDTO;
import com.garrizon.exception.ResourceNotFoundException;
import com.garrizon.model.Category;
import com.garrizon.model.Product;
import com.garrizon.repository.CategoryRepository;
import com.garrizon.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CloudinaryService cloudinaryService;

    public Page<ProductDTO> getAllProducts(String search, Long categoryId, Pageable pageable) {
        Page<Product> products;
        
        if (search != null && !search.isEmpty()) {
            products = productRepository.searchProducts(search, pageable);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
        } else {
            products = productRepository.findByIsActiveTrue(pageable);
        }
        
        return products.map(this::mapToDTO);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToDTO(product);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        String slug = productDTO.getSlug();
        if (slug == null || slug.isEmpty()) {
            slug = productDTO.getName().toLowerCase().replaceAll("[^a-z0-9]", "-") + "-" + UUID.randomUUID().toString().substring(0, 8);
        }

        Product product = Product.builder()
                .name(productDTO.getName())
                .slug(slug)
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .imageUrl(productDTO.getImageUrl())
                .category(category)
                .stock(productDTO.getStock())
                .isActive(productDTO.getIsActive() != null ? productDTO.getIsActive() : true)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (productDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(productDTO.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        if (productDTO.getName() != null) product.setName(productDTO.getName());
        if (productDTO.getDescription() != null) product.setDescription(productDTO.getDescription());
        if (productDTO.getPrice() != null) product.setPrice(productDTO.getPrice());
        if (productDTO.getImageUrl() != null) product.setImageUrl(productDTO.getImageUrl());
        if (productDTO.getStock() != null) product.setStock(productDTO.getStock());
        if (productDTO.getIsActive() != null) product.setIsActive(productDTO.getIsActive());

        Product updatedProduct = productRepository.save(product);
        return mapToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public String uploadProductImage(Long id, MultipartFile file) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        
        String imageUrl = cloudinaryService.uploadImage(file);
        product.setImageUrl(imageUrl);
        productRepository.save(product);
        
        return imageUrl;
    }

    private ProductDTO mapToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .stock(product.getStock())
                .isActive(product.getIsActive())
                .build();
    }
}
