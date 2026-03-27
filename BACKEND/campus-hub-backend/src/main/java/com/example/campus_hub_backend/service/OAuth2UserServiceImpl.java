package com.example.campus_hub_backend.service;

import com.example.campus_hub_backend.entity.User;
import com.example.campus_hub_backend.enumtype.AuthProvider;
import com.example.campus_hub_backend.enumtype.Role;
import com.example.campus_hub_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class OAuth2UserServiceImpl implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public OAuth2UserServiceImpl(UserRepository userRepository,
                                 PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = new DefaultOAuth2UserService().loadUser(userRequest);

        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String sub = oauth2User.getAttribute("sub");

        if (email == null || email.isBlank()) {
            throw new OAuth2AuthenticationException("Google account email not found");
        }

        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setName(name != null ? name : "Google User");
                    newUser.setRole(Role.USER);
                    newUser.setProvider(AuthProvider.GOOGLE);
                    newUser.setProviderId(sub);
                    newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    return userRepository.save(newUser);
                });

        if (user.getProvider() == null) {
            user.setProvider(AuthProvider.GOOGLE);
        }

        if (user.getProviderId() == null && sub != null) {
            user.setProviderId(sub);
        }

        if (name != null && !name.isBlank()) {
            user.setName(name);
        }

        userRepository.save(user);

        return oauth2User;
    }
}