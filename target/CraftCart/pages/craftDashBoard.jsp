<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CraftCart DashBoard</title>
<link rel="stylesheet" type="text/css" href="../css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="../css/bootstrap-theme.css" />
<link rel="stylesheet" type="text/css" href="../css/app/style.css" />

<script type="text/javascript" src="../js/framework/jquery-1.12.2.js"></script>
<script type="text/javascript" src="../js/framework/angular.js"></script>
<script type="text/javascript" src="../js/framework/bootstrap.js"></script>
<script type="text/javascript" src="../js/framework/validator.js"></script>
<script type="text/javascript" src="../js/cartUtils.js"></script>
<base
	href="<%=request.getScheme().toString()%>://<%=request.getServerName().toString()%>:<%=request.getServerPort()%><%=request.getContextPath().toString()%>/" />
<script>
	var msg = '${userVO.message}';
</script>

</head>
<body>
<div id="body-container" >
<input type="hidden" id="hiddenSuccessMsg" value='${userVO.message}'/>
	<!-- Page Header -->
	<jsp:include page="/pages/header.jsp"></jsp:include>
	<%-- <div class="right_content right_padding20">
		 <h6>${userVO.message}</h6>
	</div> --%>
	<jsp:include page="/pages/dashBoardContent.jsp"></jsp:include>
	<!-- Login popup page -->
	<jsp:include page="/pages/loginPopup.jsp"></jsp:include>
	<jsp:include page="/pages/signUp.jsp"></jsp:include>

	<jsp:include page="/pages/footer.jsp"></jsp:include>
</div>
</body>
</html>