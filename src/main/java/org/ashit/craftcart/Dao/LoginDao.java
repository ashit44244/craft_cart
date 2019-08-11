package org.ashit.craftcart.Dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Calendar;

import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.ashit.craftcart.model.UserVO;
import org.springframework.stereotype.Repository;

@Repository
public class LoginDao {

	final static Logger logger = Logger.getLogger(LoginDao.class);
	private DataSource dataSource;

	public DataSource getDataSource() {
		return dataSource;
	}

	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	/**
	 * @fetchUserDetails() @return
	 * @throws SQLException
	 */
	public UserVO fetchUserDetails() throws SQLException {

		String sql = "select * from account";
		logger.info("[ SQL ]  " + sql);
		Connection con = null;
		ResultSet rs = null;
		try {
			con = dataSource.getConnection();
			PreparedStatement ps = con.prepareStatement(sql);
			rs = ps.executeQuery();
			if (rs.next()) {
				String name = rs.getString("first_name");
				logger.info("first name  ::" + name);

			}
			ps.close();

		} catch (SQLException e) {
			System.out.println(e.getMessage());

		} finally {
			rs.close();
			con.close();
		}
		return null;
	}

	public UserVO authenticateUserFromDb(String userMailId) throws SQLException {
		String sql = "select * from account where email_id=?";
		logger.info("[SQL executed ]::" + sql);
		Connection con = null;
		ResultSet rs = null;
		UserVO userVo = new UserVO();
		try {
			con = dataSource.getConnection();
			logger.info(" is DB connection not null :" + con);
			PreparedStatement ps = con.prepareStatement(sql);
			ps.setString(1, userMailId);
			rs = ps.executeQuery();
			if (rs.next()) {
				String username = rs.getString("user_id");
				String password = rs.getString("password");
				String firstName = rs.getString("first_name");
				String emailId = rs.getString("email_id");
				logger.info("User details :userId " + username + "  password :" + password + " firstName : " + firstName
						+ "  email id : " + emailId);
				userVo.setFirstName(firstName);
				userVo.setPassword(password);
				userVo.setUsername(username);
				userVo.setEmailId(emailId);

			}
			logger.info("userVo : "+userVo);
			ps.close();

		} catch (SQLException e) {
			logger.error("exception occurred in user authentication :" + e.getMessage());
			throw new SQLException();

		} catch (Exception e) {
			logger.error("exception occurred in user authentication :" + e.getMessage());

		} finally {
			try {
				rs.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				logger.info(" [resultset ] exception occurred in user authentication :" + e.getMessage());
				throw new SQLException();
			}
			con.close();
		}

		return userVo;
	}

	public String registerUser(UserVO userVO) throws SQLException {
		String sql = "insert into account (USER_ID, EMAIL_ID,FIRST_NAME,LAST_NAME,GENDER,PASSWORD, MOB_NO, DOB) values (?,?,?,?,?,?,?,?)";
		String username = userVO.getUsername();
		String emailId = userVO.getEmailId();
		String fName = userVO.getFirstName();
		String lName = userVO.getLastName();
		String password = userVO.getPassword();
		char gender = userVO.getGender();
		String mobNo = "9934099340";
		Calendar dob = Calendar.getInstance();
		String insertSuccessful = "failed";
		logger.info("[Registration :: username]" + username + " emailid ::" + emailId + "  gender" + gender);
		logger.info("[SQL executed ]::" + sql);
		Connection con = null;
		try {
			con = dataSource.getConnection();
			PreparedStatement preparedStatement = con.prepareStatement(sql);
			preparedStatement.setString(1, username);
			preparedStatement.setString(2, emailId);
			preparedStatement.setString(3, fName);
			preparedStatement.setString(4, lName);
			preparedStatement.setString(5, String.valueOf(gender));
			preparedStatement.setString(6, password);
			preparedStatement.setString(7, mobNo);
			preparedStatement.setDate(8,  new java.sql.Date(dob.getTimeInMillis()));
			int row = preparedStatement.executeUpdate();
			if (row > 0) {
				logger.info("[User Registration ] :: Successful");
				insertSuccessful = "success";

			} else {
				logger.info("[User Registration ] :: Failed");
				insertSuccessful = "failed";
			}
			preparedStatement.close();
		} catch (SQLException e) {
			logger.error("SQL exception : reason ::" + e.getMessage());
		} catch (Exception e) {
			logger.error("Registration failed : reason ::" + e.getMessage());
		} finally {
			con.close();
		}
		return insertSuccessful;

	}
}
