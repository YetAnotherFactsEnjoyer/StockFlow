package com.stockflow.identity.persistence;

import com.stockflow.identity.domain.User;
import com.stockflow.support.PostgresIntegrationTest;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UserRepositoryIntegrationTest extends PostgresIntegrationTest {
  @Test
  void createsAndLoadsUuidUserFromMigratedSchema() {
    var user = users.saveAndFlush(new User("test@example.com", passwords.encode("password123")));
    assertInstanceOf(UUID.class, user.getId());
    assertTrue(users.existsByEmail("test@example.com"));
    assertEquals(user.getId(), users.findByEmail("test@example.com").orElseThrow().getId());
  }
}
