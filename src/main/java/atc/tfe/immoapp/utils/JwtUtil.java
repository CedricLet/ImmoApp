package atc.tfe.immoapp.utils;

import io.jsonwebtoken.*;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    private final Key key;
    private final long expMillis;

    public JwtUtil(@Value("${app.jwt.secret:}") String secretBase64, @Value("${app.jwt.exp-minutes}") long expMinutes) {
        if  (secretBase64 == null || secretBase64.isBlank()) {
            throw new IllegalArgumentException("secret missing. Set new secret");
        }
        byte[] decode = Decoders.BASE64.decode(secretBase64);
        if (decode.length < 32) {
            throw new IllegalArgumentException("secret is too short");
        }
        this.key = Keys.hmacShaKeyFor(decode);
        this.expMillis = expMinutes * 60 * 1000;
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }
    
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }    

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                                  .setSigningKey(key)
                                  .build()
                                  .parseClaimsJws(token)
                                  .getBody();
        return claimsResolver.apply(claims);
    }

    public String generateToken(Long userId, String role, String email) {
        Map<String, Object> claims = Map.of(
            "userId", userId,
            "role", role
        );
        Instant now = Instant.now();
        return Jwts.builder()
                    .setClaims(claims)
                   .setSubject(email)
                   .setIssuedAt(Date.from(now))
                   .setExpiration(new Date(now.toEpochMilli() + expMillis)) // 10h
                   .signWith(SignatureAlgorithm.HS256, key)
                   .compact();
    }

    public boolean validateToken(String token, String email) {
        try {
            String subject = extractEmail(token);
            return email.equals(subject) && !isTokenExpired(token);
        }catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
