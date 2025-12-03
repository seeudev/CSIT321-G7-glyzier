package com.glyzier.repository;

import com.glyzier.model.PasswordResetCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.Optional;

@Repository
public interface PasswordResetCodeRepository extends JpaRepository<PasswordResetCode, Long> {
    
    Optional<PasswordResetCode> findByEmailAndCodeAndUsedFalse(String email, String code);
    
    @Query("SELECT prc FROM PasswordResetCode prc WHERE prc.email = :email AND prc.used = false AND prc.expiresAt > :now ORDER BY prc.createdAt DESC")
    Optional<PasswordResetCode> findLatestValidCodeByEmail(@Param("email") String email, @Param("now") Timestamp now);
    
    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetCode prc SET prc.used = true WHERE prc.email = :email AND prc.used = false")
    void invalidateAllCodesForEmail(@Param("email") String email);
}

