package com.garrizon.repository;

import com.garrizon.model.Cart;
import com.garrizon.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    Optional<Cart> findByUserId(Long userId);
    
    @Query("SELECT c FROM Cart c WHERE SIZE(c.cartItems) > 0 AND " +
           "c.updatedAt < :threshold AND " +
           "(c.lastEmailSentAt IS NULL OR c.lastEmailSentAt < :emailThreshold)")
    List<Cart> findAbandonedCarts(
        @Param("threshold") LocalDateTime threshold,
        @Param("emailThreshold") LocalDateTime emailThreshold
    );
}
