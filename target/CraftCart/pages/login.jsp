<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Craft Cart</title>
<link rel="stylesheet" type="text/css" href="../css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="../css/bootstrap-theme.css" />
<link rel="stylesheet" type="text/css" href="../css/app/style.css" />

<script type="text/javascript" src="../js/framework/jquery-1.12.2.js"></script>
<script type="text/javascript" src="../js/framework/angular.js"></script>
<script type="text/javascript" src="../js/framework/bootstrap.js"></script>
<base href="">
<script type="text/javascript">

var contextPath='<%=request.getContextPath()%>';

	console.log(contextPath);
</script>
</head>
<body id="bgColor">
	<form action="<%=request.getContextPath()%>/login/authenticate.do"
		method="POST" role="form">
		<div class="container-fluid  col-md-4 col-md-offset-4 centred"
			style="padding-top: 10%;">
			<div id="loginContainer" class=" row-fluid panel panel-primary">
				<div class="panel-heading" style="font-size: 20px;">
					<span class="glyphicon glyphicon-user" style="padding-right: 5px;"></span>User
					Login
				</div>
				<div class="panel-body">
					<div class="form-group">
						<label>Email Id</label> <input type="email" name="emailId"
							placeholder="Email id" class="form-control" />
					</div>
					<div class="form-group">
						<label>Password</label> <input type="password" name="password"
							placeholder="Password" class="form-control">
					</div>
					<div class="checkbox">
						<label><input type="checkbox"></label>Remember me
					</div>
					<button class="btn btn-primary" type="submit">Login</button>

				</div>
			</div>
		</div>
	</form>
</body>
</html>