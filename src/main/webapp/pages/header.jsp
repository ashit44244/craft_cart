<!-- Header starts -->
<nav class="navbar navbar-inverse" style="margin-bottom: 0px;">
	<div class="container-fluid">
		<div class="navbar-header">
			<button type="button" class="navbar-toggle" data-toggle="collapse"
				data-target="#myNavbar">
				<span class="icon-bar"></span> <span class="icon-bar"></span> <span
					class="icon-bar"></span>
			</button>
			<a class="navbar-brand" href="#">Craft Cart</a>
		</div>
		<div class="collapse navbar-collapse" id="myNavbar">
			<ul class="nav navbar-nav">
				<li class="active"><a href="#">Cards</a></li>

				<li><a href="#">Photo Frames</a></li>
				<li><a href="#">Bottle Vase</a></li>
				<li><a href="#">Photo booth props</a></li>
				<li><a href="#">Engagement trays</a></li>
				<li><a href="#">Decoupage items</a></li>
				<li class="dropdown"><a class="dropdown-toggle"
					data-toggle="dropdown" href="#">Customize gifts <span
						class="caret"></span>
				</a>
					<ul class="dropdown-menu">
						<li><a href="#">Page 1-1</a></li>
						<li><a href="#">Page 1-2</a></li>
						<li><a href="#">Page 1-3</a></li>
					</ul></li>
			</ul>
			<ul class="nav navbar-nav navbar-right">
				<li><a href="#" data-toggle="modal" data-target="#signUpModal"><span
						class="glyphicon glyphicon-user"></span> Sign Up</a></li>
				<li class="loginDropdown"><a id="loginButton" href="#"
					data-toggle="modal" data-target="#loginModal"><span
						class="glyphicon glyphicon-log-in"></span> Login</a> <a
					id="successMsg" class="dropdown-toggle" data-toggle="dropdown"
					style="display: none;">${userVO.message} <span class="caret"></span></a>
					<ul class="dropdown-menu" style="font-size: 13px; min-width: 126px">
						<li><a href="#">Account</a></li>
						<li><a href="#">Orders</a></li>
						<li><a href="#">Wishlist</a></li>
						<li><a href="#">Log Out</a></li>
					</ul></li>

				<!-- <li><a  href="#"  onclick="login();return false;"><span
						class="glyphicon glyphicon-log-in"></span> Login</a></li>
 -->
			</ul>
		</div>
	</div>
</nav>
<!-- Header ends  -->