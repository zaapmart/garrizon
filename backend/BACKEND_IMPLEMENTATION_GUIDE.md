# Backend Implementation Guide - Admin Dashboard APIs

## ✅ Completed

### Database Migrations

- ✅ `migrations/MASTER_MIGRATION.sql` - Run this in your SQL editor
- ✅ Creates: orders, order_items, transactions, banners tables
- ✅ Adds inventory tracking to products table

### Entities Created

- ✅ `Order.java` - Order entity with status tracking
- ✅ `OrderItem.java` - Order items with product snapshots
- ✅ `Transaction.java` - Payment transaction tracking
- ✅ `Banner.java` - Homepage banner management

## 📋 Next Steps - Create These Files

### 1. Repositories (Create in `repository/` folder)

**OrderRepository.java**:

```java
package com.garrizon.repository;

import com.garrizon.model.Order;
import com.garrizon.model.Order.OrderStatus;
import com.garrizon.model.Order.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
    
    Page<Order> findByPaymentStatus(PaymentStatus paymentStatus, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(:paymentStatus IS NULL OR o.paymentStatus = :paymentStatus) AND " +
           "(:search IS NULL OR o.orderNumber LIKE %:search% OR " +
           "o.shippingName LIKE %:search% OR o.shippingEmail LIKE %:search%)")
    Page<Order> findByFilters(@Param("status") OrderStatus status,
                               @Param("paymentStatus") PaymentStatus paymentStatus,
                               @Param("search") String search,
                               Pageable pageable);
    
    List<Order> findTop10ByOrderByCreatedAtDesc();
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :startDate")
    Long countOrdersToday(@Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    Long countByStatus(@Param("status") OrderStatus status);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.createdAt >= :startDate AND o.paymentStatus = 'PAID'")
    BigDecimal sumRevenueToday(@Param("startDate") LocalDateTime startDate);
}
```

**TransactionRepository.java**:

```java
package com.garrizon.repository;

import com.garrizon.model.Transaction;
import com.garrizon.model.Transaction.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    
    Optional<Transaction> findByReference(String reference);
    
    Page<Transaction> findByStatus(TransactionStatus status, Pageable pageable);
    
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:search IS NULL OR t.reference LIKE %:search% OR " +
           "t.customerName LIKE %:search% OR t.customerEmail LIKE %:search%)")
    Page<Transaction> findByFilters(@Param("status") TransactionStatus status,
                                     @Param("search") String search,
                                     Pageable pageable);
    
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = :status")
    Long countByStatus(@Param("status") TransactionStatus status);
}
```

**BannerRepository.java**:

```java
package com.garrizon.repository;

import com.garrizon.model.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    
    List<Banner> findByIsActiveTrueOrderByDisplayOrderAsc();
    
    @Query("SELECT b FROM Banner b WHERE b.isActive = true AND " +
           "(b.startDate IS NULL OR b.startDate <= :now) AND " +
           "(b.endDate IS NULL OR b.endDate >= :now) " +
           "ORDER BY b.displayOrder ASC")
    List<Banner> findActiveBanners(@Param("now") LocalDateTime now);
}
```

### 2. DTOs (Create in `dto/` folder)

**OrderDTO.java**, **TransactionDTO.java**, **BannerDTO.java**,
**DashboardStatsDTO.java**

### 3. Services (Create in `service/` folder)

**OrderService.java**, **TransactionService.java**, **BannerService.java**

### 4. Controllers (Create/Update in `controller/` folder)

**Update AdminController.java** to add new endpoints:

- `GET /api/admin/dashboard/stats`
- `GET /api/admin/dashboard/recent-orders`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status`
- `GET /api/admin/transactions`
- `GET /api/admin/banners`
- `POST /api/admin/banners`
- `PUT /api/admin/banners/{id}`
- `DELETE /api/admin/banners/{id}`

## 🚀 Quick Start

### Step 1: Run Database Migration

```sql
-- Open your MySQL client and run:
source /path/to/migrations/MASTER_MIGRATION.sql
-- OR copy and paste the contents of MASTER_MIGRATION.sql
```

### Step 2: Verify Tables Created

```sql
SHOW TABLES;
DESCRIBE orders;
DESCRIBE order_items;
DESCRIBE transactions;
DESCRIBE banners;
DESCRIBE products;
```

### Step 3: Build Backend

```bash
cd backend
.\mvnw.cmd clean package -DskipTests
```

### Step 4: Deploy

Upload the WAR file to your Tomcat server.

## 📝 Notes

The entities are ready. You need to create:

1. Repositories (3 files)
2. DTOs (4-5 files)
3. Services (3 files)
4. Update AdminController (1 file)

Would you like me to generate all these files now?
