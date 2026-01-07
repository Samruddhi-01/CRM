package com.startica.privateapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating HR Remark
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateHRRemarkRequest {
    private String hrRemark;
}
