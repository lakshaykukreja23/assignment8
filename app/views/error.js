<!DOCTYPE html>
<html lang="en">
<head>
  <style type="text/css">
    .error-box
    {
      padding: 5%;
      margin-left:20%;
      margin-right: 20%;
      margin-top: 0;
    }

    .input-block
    {
      margin: 5%;
    }

    form div input
    {
      width: 100%;
      margin: 0 !important;
      padding: 2%;
    }

    button
    {
      width: 30%;
      margin-left: 35%;
      margin-right: 35%;
      padding: 2%;
      background-color: transparent;
      border-radius: 12px;
    }
    p
    {
      text-align : center;
    }
    .link
    {
      text-decoration: none;
      float: center;
    }
  </style>
</head>
<body>
  <main>
  <div class="error-box">
    <br>
    <p class="header"><b><i style="font-size:18px;"></i>error occured </b></p>
    <br>
    <p> Error Says : <code> <%= message %>  </code></p>
    <p> Status : <code> <%= status %>   </code></p>
    <p><a class="link" href ="http://localhost:3000/v1/users/loginPage" ><b>Login</b></a></p>
    <p><a class="link" href ="http://localhost:3000/v1/users/signupPage" ><b>Sign up</b></a></p>
  </div>
  </main>
</body>
</html>