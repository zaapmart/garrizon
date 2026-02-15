package com.garrizon.model;

import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Builder.Default
    @Column(name = "user_role")
    private String userRole = "ROLE_USER";

    @Builder.Default
    @Column(nullable = false)
    private String city = "Default City";

    @Builder.Default
    @Column(nullable = false)
    private String country = "Nigeria";

    @Builder.Default
    @Column(nullable = false)
    private String state = "Default State";

    @Builder.Default
    @Column(nullable = false)
    private String phone = "0000000000";

    @Builder.Default
    @Column(name = "alt_phone", nullable = false)
    private String altPhone = "0000000000";

    @Column(name = "date_created", nullable = false)
    private LocalDateTime dateCreated;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (dateCreated == null)
            dateCreated = LocalDateTime.now();
        if (createdAt == null)
            createdAt = LocalDateTime.now();
        if (updatedAt == null)
            updatedAt = LocalDateTime.now();

        // Defensive defaults for legacy/strict DB constraints
        if (city == null)
            city = "Default City";
        if (country == null)
            country = "Nigeria";
        if (state == null)
            state = "Default State";
        if (phone == null)
            phone = "0000000000";
        if (altPhone == null)
            altPhone = "0000000000";
        if (userRole == null)
            userRole = "ROLE_USER";
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
