package org.ashit.craftcart.services;

import java.sql.SQLException;

import org.ashit.craftcart.model.UserVO;

public interface LoginService {

	public UserVO getUserDetails();

	public UserVO autheticateUser(String emailId) throws SQLException;

	public String  registerUser(UserVO userVO) throws SQLException;

}
