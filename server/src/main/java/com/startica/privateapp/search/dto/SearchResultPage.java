package com.startica.privateapp.search.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class SearchResultPage<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean first;
    private boolean last;
    private boolean empty;
    
    // Search metadata
    private String query;
    private long searchTimeMs;
    
    public static <T> SearchResultPage<T> of(List<T> content, int page, int size, long totalElements, String query, long searchTimeMs) {
        return SearchResultPage.<T>builder()
                .content(content)
                .page(page)
                .size(size)
                .totalElements(totalElements)
                .totalPages((int) Math.ceil((double) totalElements / size))
                .first(page == 0)
                .last(page >= Math.ceil((double) totalElements / size) - 1)
                .empty(content.isEmpty())
                .query(query)
                .searchTimeMs(searchTimeMs)
                .build();
    }
}
