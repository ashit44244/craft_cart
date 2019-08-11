<!-- Login pop up page starts -->
<!-- Modal -->
	<div  id="loginModal" class="modal fade" role="dialog">
	 <div class="modal-dialog" class="col-md-4 col-md-offset-4 centred">
	 <!-- Modal content-->
		<form action="<%=request.getContextPath()%>/login/authenticate.do"
			method="POST" role="form" data-toggle="validator">
			<div class="container-fluid" style="padding-top: 10%;">
				<div id="loginContainer" class=" row-fluid panel panel-primary">
					<div class="panel-heading modal-header" style="font-size: 20px;">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
						<span class="glyphicon glyphicon-user" style="padding-right: 5px;"></span>User
						Login
					</div>
					<div class="panel-body modal-body">
						<div class="form-group">
							<label>Email Id</label> <input type="email" name="emailId"
								placeholder="Email id" class="form-control"required  />
						</div>
						<div class="form-group">
							<label>Password</label> <input type="password" name="password"
								placeholder="Password" class="form-control" required >
						</div>
						<div class="checkbox">
							<label><input type="checkbox"></label>Remember me
						</div>
						<button class="btn btn-primary" type="submit">Login</button>

					</div>
				</div>
			</div>
		</form>
		</div>
	</div>
	<!-- Login pop up ends -->


