package org.ashit.craftcart.controller;

import java.sql.SQLException;
import java.util.List;

import org.apache.log4j.Logger;
import org.ashit.craftcart.AlertService;
import org.ashit.craftcart.model.UserVO;
import org.ashit.craftcart.services.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/login")
public class LoginController {

	@Autowired(required = true)
	@Qualifier("loginService")
	private LoginService loginService;
	
	@Autowired
	private AlertService alertService;
	
	
	final static Logger log = Logger.getLogger(LoginController.class);

	@RequestMapping(value = "/authenticate", method = RequestMethod.POST)
	public ModelAndView authenticate(@ModelAttribute UserVO user) {
		log.info("[login controller ]request params :: " + user.getEmailId() + "  password :: " + user.getPassword());
		
		alertService.spitterSerice(user);
		
		
		UserVO userVO = new UserVO();
		try {
			if (null != user && "" != user.getEmailId())
				userVO = loginService.autheticateUser(user.getEmailId());

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage());
		}

		if (null != userVO && null != user && userVO.getEmailId().equalsIgnoreCase(user.getEmailId())
				&& userVO.getPassword().equals(user.getPassword())) {
			userVO.setMessage("Hi " + userVO.getFirstName() + " !");
			ModelAndView modelAndView = new ModelAndView("craftDashBoard", "userVO", userVO);
			log.info("User authentication successful ");
			return modelAndView;
		} else {
			ModelAndView modelAndView = new ModelAndView("craftDashBoard", "message", "Invalid email id or password");

			return modelAndView;
		}

	}

	/*
	 * @RequestMapping(value = "/authenticate", method = RequestMethod.GET)
	 * public String authenticate2(@RequestParam String username, Model model) {
	 * System.out.println("username ::"+username); model.addAttribute("message",
	 * "welcome"); return "craftDashBoard";
	 * 
	 * }
	 */
	@RequestMapping(value = "/userRegistration", method = RequestMethod.POST)
	public String userRegistration(@ModelAttribute UserVO userVO, Model model) {
		log.info("User registration " + userVO.getEmailId());
		
		alertService.receiveAlert();
		/*try {
			
			String status = loginService.registerUser(userVO);
			log.info("[User Registration Status :]" + status);
			model.addAttribute("status", status);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			log.error(e.getMessage());
		}*/
		return "craftDashBoard";
	}

}
