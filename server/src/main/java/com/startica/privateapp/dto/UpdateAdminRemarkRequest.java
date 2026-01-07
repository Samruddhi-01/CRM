package com.startica.privateapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating Admin Remark
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAdminRemarkRequest {
    private String adminRemark;
}
