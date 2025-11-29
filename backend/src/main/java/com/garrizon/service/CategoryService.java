package com.garrizon.service;

import com.garrizon.dto.CategoryDTO;
import com.garrizon.exception.ResourceNotFoundException;
import com.garrizon.model.Category;
import com.garrizon.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO> getAllCategories() {
        // We might want to return only root categories here, or all.
        // If we return all, the frontend can build the tree or we build it here.
        // Let's return root categories (where parent is null) and let JPA fetch
        // subcategories.
        List<Category> rootCategories = categoryRepository.findByParentIsNull();
        return rootCategories.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CategoryDTO getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return mapToDTO(category);
    }

    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category.CategoryBuilder categoryBuilder = Category.builder()
                .name(categoryDTO.getName())
                .slug(categoryDTO.getSlug())
                .description(categoryDTO.getDescription())
                .imageUrl(categoryDTO.getImageUrl())
                .isActive(categoryDTO.getIsActive() != null ? categoryDTO.getIsActive() : true);

        if (categoryDTO.getParentId() != null) {
            Category parent = categoryRepository.findById(categoryDTO.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            categoryBuilder.parent(parent);
        }

        Category category = categoryBuilder.build();
        Category savedCategory = categoryRepository.save(category);
        return mapToDTO(savedCategory);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found");
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO mapToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .parentName(category.getParent() != null ? category.getParent().getName() : null)
                .subcategories(category.getSubcategories() != null
                        ? category.getSubcategories().stream().map(this::mapToDTO).collect(Collectors.toList())
                        : Collections.emptyList())
                .isActive(category.getIsActive())
                .build();
    }
}
