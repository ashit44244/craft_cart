package org.ashit.craftcart;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.ObjectMessage;
import javax.jms.Session;

import org.apache.log4j.Logger;
import org.ashit.craftcart.controller.LoginController;
import org.ashit.craftcart.model.UserVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Service;


@Service
public class AlertServiceImpl implements AlertService {

	final static Logger log = Logger.getLogger(LoginController.class);
	
	@Autowired
	JmsTemplate jmsTemplate;
	
	public void spitterSerice(final UserVO userVo) {
	log.info("alert service called");
		jmsTemplate.send (new MessageCreator() {
			
			public Message createMessage(Session session) throws JMSException {
				// TODO Auto-generated method stub
				return session.createObjectMessage(userVo);
			}
		});
		
	}

	public UserVO receiveAlert() {
		
		ObjectMessage receivedMsg = (ObjectMessage)  jmsTemplate.receive();
		try {
			UserVO user = (UserVO) receivedMsg.getObject();
			System.out.println("firstname" + user.getFirstName());
			log.info("email id " + user.getEmailId());
		} catch (JMSException e) {
			log.error("jms errro in msg receive");
			e.printStackTrace();
		}
		return null;
	}

}
