package org.ashit.craftcart.services;

import java.sql.SQLException;

import org.apache.log4j.Logger;
import org.ashit.craftcart.Dao.LoginDao;
import org.ashit.craftcart.model.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("loginService2")
public class LoginServiceImpl2 implements LoginService {

	@Autowired
	private LoginDao loginDao;
	final static Logger logger = Logger.getLogger(LoginServiceImpl2.class);

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.ashit.craftcart.services.LoginService#getUserDetails()
	 */
	public UserVO getUserDetails() {
		logger.info("service caled");
		try {
			loginDao.fetchUserDetails();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			logger.error(e.getMessage());
		}

		return null;
	}

	public UserVO autheticateUser(String emailId) throws SQLException {
		// TODO Auto-generated method stub
		//UserVO userVO = loginDao.authenticateUserFromDb(emailId);
		logger.info("new service called");
		return null;
	}

	public String registerUser(UserVO userVO) throws SQLException {
		return loginDao.registerUser(userVO);
		
	}

}
