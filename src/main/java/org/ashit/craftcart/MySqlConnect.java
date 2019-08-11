package org.ashit.craftcart;
 


import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.mysql.jdbc.Connection;
import com.mysql.jdbc.Statement;


public class MySqlConnect {

	public static void main(String[] args) throws SQLException {
		// TODO Auto-generated method stub

		String url="jdbc:mysql://mysql-10518-env-tomcat.dal.jelastic.vps-host.net/craftcart";
		String user="ashit";
		String password="TuNNKrD7T7VZEnUe";
		Connection con =null;
		Statement myStat =null;
		ResultSet res =null;
		try {
			Class.forName("com.mysql.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			System.out.println("Where is your MySQL JDBC Driver?");
			e.printStackTrace();
			
		}
		try {
			 con =  (Connection) DriverManager.getConnection(url, user, password);
			 System.out.println("con :"+con);
			 myStat = (Statement) con.createStatement();
			 res =  myStat.executeQuery("select * from craftcart.account");
			while(res.next()){
				System.out.println(res.getString("first_name"));
				
			}
			
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			System.out.println(e.getMessage());
		}
		finally{
			res.close();
			con.close();
			
		}
		
		
		
	}

}
