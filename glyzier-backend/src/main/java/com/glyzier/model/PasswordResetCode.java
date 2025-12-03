package com.glyzier.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "password_reset_codes")
public class PasswordResetCode {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "email", nullable = false)
    private String email;
    
    @Column(name = "code", nullable = false, length = 6)
    private String code;
    
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;
    
    @Column(name = "expires_at", nullable = false)
    private Timestamp expiresAt;
    
    @Column(name = "used", nullable = false)
    private Boolean used = false;
    
    public PasswordResetCode() {}
    
    public PasswordResetCode(String email, String code, Timestamp createdAt, Timestamp expiresAt) {
        this.email = email;
        this.code = code;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.used = false;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
    
    public Timestamp getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Timestamp expiresAt) { this.expiresAt = expiresAt; }
    
    public Boolean getUsed() { return used; }
    public void setUsed(Boolean used) { this.used = used; }
}

