<?php
// login.php
session_start();

// Database connection settings
$host = 'localhost';
$dbname = 'careerconnect';
$username = 'root'; // Change to your MySQL username
$password = ''; // Change to your MySQL password

// Create database connection
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    
    if (!empty($username) && !empty($password)) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                
                // Redirect to index.php
                header("Location: index.php");
                exit();
            } else {
                $error = "Invalid username/email or password!";
            }
        } catch(PDOException $e) {
            $error = "Database error: " . $e->getMessage();
        }
    } else {
        $error = "Please fill in all fields!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CareerConnect - Login</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    /* Your existing CSS styles here */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    }

    body {
      height: 100vh;
      background: linear-gradient(270deg, #667eea, #764ba2, #ff6b6b);
      background-size: 600% 600%;
      animation: gradientShift 20s ease infinite;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .login-container {
      background: rgba(255, 255, 255, 0.15);
      padding: 40px;
      width: 380px;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 10;
      animation: fadeIn 1s ease forwards;
    }

    @keyframes fadeIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .login-container h2 {
      color: #fff;
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
      position: relative;
    }

    .login-container h2::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #ff6b6b);
      border-radius: 2px;
    }

    .input-group {
      margin-bottom: 20px;
      position: relative;
      animation: fadeInUp 0.6s ease forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .input-group:nth-child(1) { animation-delay: 0.1s; }
    .input-group:nth-child(2) { animation-delay: 0.2s; }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .input-group label {
      color: #eee;
      font-size: 14px;
      display: block;
      margin-bottom: 5px;
    }

    .input-group input {
      width: 100%;
      padding: 12px 16px;
      border-radius: 10px;
      border: none;
      background-color: rgba(255, 255, 255, 0.1);
      color: #fff;
      outline: none;
      transition: 0.3s;
    }

    .input-group input:focus {
      background-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 0 10px #667eea;
    }

    .toggle-password {
      position: absolute;
      right: 15px;
      top: 40px;
      color: #ccc;
      cursor: pointer;
    }

    .login-btn {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 16px;
      color: #fff;
      background: linear-gradient(135deg, #667eea, #764ba2);
      box-shadow: 0 8px 15px rgba(102, 126, 234, 0.4);
      cursor: pointer;
      transition: 0.3s;
      position: relative;
      overflow: hidden;
      animation: fadeInUp 0.6s ease 0.3s forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px rgba(102, 126, 234, 0.5);
    }

    .login-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.5s ease;
    }

    .login-btn:hover::before {
      left: 100%;
    }

    .social-login {
      margin: 25px 0;
      display: flex;
      justify-content: center;
      gap: 15px;
      animation: fadeInUp 0.6s ease 0.4s forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .social-login a {
      text-decoration: none;
    }

    .social-btn {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.1);
      transition: 0.3s;
      cursor: pointer;
    }

    .social-btn:hover {
      transform: scale(1.1);
      background: rgba(255, 255, 255, 0.2);
    }

    .signup {
      margin-top: 20px;
      text-align: center;
      color: #eee;
      font-size: 14px;
      animation: fadeInUp 0.6s ease 0.5s forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .signup a {
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      transition: 0.3s;
      position: relative;
    }

    .signup a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: #fff;
      transition: width 0.3s ease;
    }

    .signup a:hover::after {
      width: 100%;
    }

    .error-message {
      background: rgba(255, 107, 107, 0.2);
      color: #fff;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 15px;
      text-align: center;
      border: 1px solid rgba(255, 107, 107, 0.5);
    }

    @media (max-width: 480px) {
      .login-container {
        width: 90%;
      }
    }
  </style>
</head>
<body>
  <div class="floating-icons" id="floatingIcons"></div>
  
  <div class="login-container">
    <h2>Welcome Back</h2>
    
    <?php if (!empty($error)): ?>
      <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>
    
    <form method="POST" action="">
      <div class="input-group">
        <label for="username">Username or Email</label>
        <input type="text" id="username" name="username" placeholder="Enter your username or email" required value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>">
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Enter password" required>
        <span class="toggle-password" id="togglePassword"><i class="fas fa-eye"></i></span>
      </div>
      <button type="submit" class="login-btn" id="loginButton">
        Login
      </button>

      <div class="social-login">
        <a class="social-btn" href="https://accounts.google.com" target="_blank" title="Login with Google">
          <i class="fab fa-google"></i>
        </a>
        <a class="social-btn" href="https://www.linkedin.com/login" target="_blank" title="Login with LinkedIn">
          <i class="fab fa-linkedin-in"></i>
        </a>
        <a class="social-btn" href="https://github.com/login" target="_blank" title="Login with GitHub">
          <i class="fab fa-github"></i>
        </a>
      </div>

      <div class="signup">
        Don't have an account? <a href="register.php">Sign Up</a>
      </div>
    </form>
  </div>

  <script>
    // Create floating icons
    const floatingIcons = document.getElementById('floatingIcons');
    const icons = ['fa-user', 'fa-envelope', 'fa-lock', 'fa-star', 'fa-heart'];
    
    for (let i = 0; i < 15; i++) {
      const icon = document.createElement('i');
      icon.className = `floating-icon fas ${icons[Math.floor(Math.random() * icons.length)]}`;
      icon.style.left = `${Math.random() * 100}%`;
      icon.style.animationDelay = `${Math.random() * 15}s`;
      icon.style.fontSize = `${Math.random() * 20 + 15}px`;
      floatingIcons.appendChild(icon);
    }

    // Password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });
  </script>
</body>
</html>