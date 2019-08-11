<!-- Login pop up page starts -->
<!-- Modal -->
<div id="signUpModal" class="modal fade" role="dialog">
	<div class="modal-dialog" class="col-md-4 col-md-offset-4 centred">
		<!-- Modal content-->
		<form class="login-registration-form"
			action="<%=request.getContextPath()%>/login/userRegistration.do"
			method="POST" role="form">
			<div class="container-fluid" style="padding-top: 0%;">
				<div id="signUpContainer" class=" row-fluid panel panel-primary">
					<div class="panel-heading modal-header" style="font-size: 20px;">
						<button type="button" class="close" data-dismiss="modal">&times;</button>
						<span class="glyphicon glyphicon-user" style="padding-right: 5px;"></span>User
						Registration
					</div>
					<div class="panel-body modal-body">
						<div class="form-group">
							<label>First Name</label> <input type="text" name="firstName"
								placeholder="First Name" class="form-control" required />
						</div>
						<div class="form-group" style="margin-bottom: 10px;">
							<label>Last Name</label> <input type="text" name="lastName"
								placeholder="Last Name" class="form-control" required />
						</div>
						<div class="form-group form-inline" style="margin-bottom: 10px;">
							<input type="radio" name="gender" value="M" class="form-control"
								required></input><label style="margin-left: 8px;">Male</label> <input
								type="radio" name="gender" value="F" class="form-control"
								required></input><label style="margin-left: 8px;">Female</label>
						</div>
						<!-- <hr id="registration-dividing-line"> -->
						<div class="form-group">
							<label>Email Id</label> <input type="email" name="emailId"
								placeholder="Email id" class="form-control" required />
						</div>
						<div class="form-group">
							<label>Password</label> <input type="password" name="password"
								placeholder="Password" class="form-control" required>
						</div>
						<div class="form-group">
							<label>Confirm Password</label> <input type="password"
								name="cPassword" placeholder="Confirm Password"
								class="form-control" required>
						</div>
						<div class="form-group">
							<label>Username</label> <input type="text" name="username"
								placeholder="User Name" class="form-control" required>
						</div>
						<div class="checkbox"
							style="font-size: 11px; font-style: oblique;">
							<label><input type="checkbox" style=""></label>I want to
							receive Craft cart Finds, an email newsletter of fresh trends and
							editors' picks.
						</div>
						<button class="btn btn-primary" type="submit">Register</button>

					</div>
				</div>
			</div>
		</form>
	</div>
</div>
<!-- Login pop up ends -->


