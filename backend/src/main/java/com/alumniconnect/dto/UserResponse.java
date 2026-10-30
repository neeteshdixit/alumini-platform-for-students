package com.alumniconnect.dto;

import com.alumniconnect.model.User;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;
    private String college;
    private String rollNumber;
    private String branch;
    private String company;
    private String designation;
    private String batch;

    public UserResponse() {
    }

    public static UserResponse fromUser(User user) {
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setFullName(user.getFullName());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole());
        resp.setCollege(user.getCollege());
        resp.setRollNumber(user.getRollNumber());
        resp.setBranch(user.getBranch());
        resp.setCompany(user.getCompany());
        resp.setDesignation(user.getDesignation());
        resp.setBatch(user.getBatch());
        return resp;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getBatch() {
        return batch;
    }

    public void setBatch(String batch) {
        this.batch = batch;
    }
}

