<?php
// register.php
session_start();
require_once 'login.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $phone = trim($_POST['phone']);
    
    // Validation
    if (empty($username) || empty($email) || empty($password) || empty($phone)) {
        $error = "All fields are required!";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = "Invalid email format!";
    } elseif (strlen($password) < 6) {
        $error = "Password must be at least 6 characters long!";
    } else {
        try {
            // Check if username or email already exists
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            
            if ($stmt->rowCount() > 0) {
                $error = "Username or email already exists!";
            } else {
                // Hash password
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                
                // Insert new user
                $stmt = $pdo->prepare("INSERT INTO users (username, email, password, phone_number) VALUES (?, ?, ?, ?)");
                $stmt->execute([$username, $email, $hashedPassword, $phone]);
                
                $success = "Registration successful! You can now login.";
                
                // Clear form
                $username = $email = $phone = '';
            }
        } catch(PDOException $e) {
            $error = "Database error: " . $e->getMessage();
        }
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CareerConnect - Sign Up</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
   <style>
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

    .signup-container {
      background: rgba(255, 255, 255, 0.15);
      padding: 40px;
      width: 420px;
      border-radius: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      z-index: 10;
      animation: slideIn 0.8s ease forwards;
      transform: translateY(30px);
      opacity: 0;
    }

    @keyframes slideIn {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .signup-container h2 {
      color: #fff;
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
      position: relative;
    }

    .signup-container h2::after {
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
    .input-group:nth-child(3) { animation-delay: 0.3s; }
    .input-group:nth-child(4) { animation-delay: 0.4s; }

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

    .signup-btn {
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
      animation: fadeInUp 0.6s ease 0.5s forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .signup-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 20px rgba(102, 126, 234, 0.5);
    }

    .signup-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.5s ease;
    }

    .signup-btn:hover::before {
      left: 100%;
    }

    .login {
      margin-top: 20px;
      text-align: center;
      color: #eee;
      font-size: 14px;
      animation: fadeInUp 0.6s ease 0.6s forwards;
      opacity: 0;
      transform: translateY(20px);
    }

    .login a {
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      transition: 0.3s;
      position: relative;
    }

    .login a::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: #fff;
      transition: width 0.3s ease;
    }

    .login a:hover::after {
      width: 100%;
    }

    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-left: 10px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .floating-icons {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
    }

    .floating-icon {
      position: absolute;
      color: rgba(255, 255, 255, 0.1);
      font-size: 24px;
      animation: float 15s infinite linear;
    }

    @keyframes float {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.1;
      }
      90% {
        opacity: 0.1;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    .strength-meter {
      height: 5px;
      border-radius: 5px;
      margin-top: 5px;
      background: rgba(255, 255, 255, 0.1);
      overflow: hidden;
    }

    .strength-meter::after {
      content: '';
      display: block;
      height: 100%;
      width: 0;
      border-radius: 5px;
      transition: width 0.3s, background 0.3s;
    }

    .strength-weak::after {
      width: 33%;
      background: #ff6b6b;
    }

    .strength-medium::after {
      width: 66%;
      background: #feca57;
    }

    .strength-strong::after {
      width: 100%;
      background: #1dd1a1;
    }

    @media (max-width: 480px) {
      .signup-container {
        width: 90%;
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="floating-icons" id="floatingIcons"></div>
  
  <div class="signup-container">
    <h2>Create Your Account</h2>
    
    <?php if (!empty($error)): ?>
      <div class="error-message"><?php echo htmlspecialchars($error); ?></div>
    <?php endif; ?>
    
    <?php if (!empty($success)): ?>
      <div class="success-message"><?php echo htmlspecialchars($success); ?></div>
    <?php endif; ?>
    
    <form method="POST" action="">
      <div class="input-group">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" placeholder="Enter your username" required value="<?php echo isset($_POST['username']) ? htmlspecialchars($_POST['username']) : ''; ?>">
      </div>
      <div class="input-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>">
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="Create password" required>
        <span class="toggle-password" id="togglePassword"><i class="fas fa-eye"></i></span>
        <div class="strength-meter" id="strengthMeter"></div>
      </div>
      <div class="input-group">
        <label for="phone">Phone Number</label>
        <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required value="<?php echo isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : ''; ?>">
      </div>
      <button type="submit" class="signup-btn" id="signupButton">
        Sign Up
      </button>

      <div class="login">
        Already have an account? <a href="login.php">Log In</a>
      </div>
    </form>
  </div>

  <script>
    // Create floating icons
    const floatingIcons = document.getElementById('floatingIcons');
    const icons = ['fa-user', 'fa-envelope', 'fa-lock', 'fa-phone', 'fa-star', 'fa-heart'];
    
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
    const strengthMeter = document.getElementById('strengthMeter');

    togglePassword.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
    });

    // Password strength indicator
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      let strength = 0;
      
      if (password.length >= 8) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      
      strengthMeter.className = 'strength-meter';
      if (password.length > 0) {
        if (strength <= 2) {
          strengthMeter.classList.add('strength-weak');
        } else if (strength === 3) {
          strengthMeter.classList.add('strength-medium');
        } else {
          strengthMeter.classList.add('strength-strong');
        }
      }
    });

    // Form submission with loading state
    const signupForm = document.querySelector('form');
    const signupButton = document.getElementById('signupButton');

    signupForm.addEventListener('submit', function (e) {
      // Client-side validation
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const phone = document.getElementById('phone').value;

      if (!username || !email || !password || !phone) {
        e.preventDefault();
        return;
      }

      // Add loading state
      signupButton.innerHTML = 'Signing Up...';
      signupButton.disabled = true;
    });
  </script>
</body>
</html>