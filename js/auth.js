/**
 * AgriVision - Authentication Controller (Login & Sign-Up Interface)
 * Compliant with FR-8.1 (< 90 seconds onboarding target)
 * Features 1-tap Auto-Filled Demo Accounts (Apparao, Lakshmi, KVK Expert)
 */

function initAuthUI() {
  // Check if a user is already logged in, otherwise default to Apparao demo
  let currentUser = DB.getCurrentUser();
  if (!currentUser) {
    // Auto-login into Apparao Demo Account for immediate testing experience
    const res = DB.login('apparao@agrivision.in', 'farmer123');
    if (res.success) {
      currentUser = res.user;
    }
  }

  updateAuthUIState(currentUser);
}

function showAuthModal(mode = 'login') {
  const modal = document.getElementById('auth-modal-overlay');
  if (!modal) return;
  modal.style.display = 'flex';
  switchAuthTab(mode);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal-overlay');
  if (!modal) return;
  modal.style.display = 'none';
}

function switchAuthTab(tab) {
  const loginForm = document.getElementById('auth-login-form');
  const signupForm = document.getElementById('auth-signup-form');
  const tabLogin = document.getElementById('auth-tab-btn-login');
  const tabSignup = document.getElementById('auth-tab-btn-signup');

  if (tab === 'login') {
    if (loginForm) loginForm.style.display = 'block';
    if (signupForm) signupForm.style.display = 'none';
    if (tabLogin) tabLogin.classList.add('active');
    if (tabSignup) tabSignup.classList.remove('active');
  } else {
    if (loginForm) loginForm.style.display = 'none';
    if (signupForm) signupForm.style.display = 'block';
    if (tabLogin) tabLogin.classList.remove('active');
    if (tabSignup) tabSignup.classList.add('active');
  }
}

// Auto-Fill Demo Credentials (1-Tap Fast Login)
function fillDemoAccount(type) {
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-pass');

  switchAuthTab('login');

  if (type === 'apparao') {
    if (emailInput) emailInput.value = 'apparao@agrivision.in';
    if (passInput) passInput.value = 'farmer123';
    showToast('Auto-filled Demo: Apparao Nimmana (Farmer 2.5 Ac)');
  } else if (type === 'lakshmi') {
    if (emailInput) emailInput.value = 'lakshmi@agrivision.in';
    if (passInput) passInput.value = 'farmer123';
    showToast('Auto-filled Demo: Lakshmi Penumatsa (Semi-Arid 4.0 Ha)');
  } else if (type === 'kvk') {
    if (emailInput) emailInput.value = 'kvk.expert@agrivision.in';
    if (passInput) passInput.value = 'expert123';
    showToast('Auto-filled Demo: Dr. K. Rao (KVK Agronomist)');
  }
}

// Handle Login Form Submit
function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-pass').value;

  const result = DB.login(email, pass);
  if (result.success) {
    closeAuthModal();
    updateAuthUIState(result.user);
    
    // Switch to user's assigned plots
    const userPlots = DB.getUserPlots(result.user.id);
    if (userPlots.length > 0) {
      STATE.parcels = userPlots;
      STATE.activeParcelId = userPlots[0].id;
    }

    if (window.updateParcelSelectorUI) window.updateParcelSelectorUI();
    if (window.render2D) window.render2D();
    if (window.render3D) window.render3D();
    if (window.renderProfileUI) window.renderProfileUI();

    showToast(`Welcome back, ${result.user.name}!`);
  } else {
    showToast(`⚠️ ${result.error}`, 4000);
  }
}

// Handle Sign-Up Form Submit
function handleSignupSubmit(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  const phone = document.getElementById('signup-phone').value;
  const village = document.getElementById('signup-village').value;
  const pass = document.getElementById('signup-pass').value;
  const role = document.getElementById('signup-role').value;

  if (!name || !email || !pass) {
    showToast('⚠️ Please fill in all required fields.', 3000);
    return;
  }

  const result = DB.signup({
    name,
    email,
    phone,
    village,
    password: pass,
    role
  });

  if (result.success) {
    closeAuthModal();
    updateAuthUIState(result.user);

    const userPlots = DB.getUserPlots(result.user.id);
    if (userPlots.length > 0) {
      STATE.parcels = userPlots;
      STATE.activeParcelId = userPlots[0].id;
    }

    if (window.updateParcelSelectorUI) window.updateParcelSelectorUI();
    if (window.render2D) window.render2D();
    if (window.render3D) window.render3D();
    if (window.renderProfileUI) window.renderProfileUI();

    showToast(`Account created! Welcome to AgriVision, ${result.user.name}!`);
  } else {
    showToast(`⚠️ ${result.error}`, 4000);
  }
}

// Sign-Out
function handleSignOut() {
  DB.logout();
  showToast('You have signed out.');
  showAuthModal('login');
  updateAuthUIState(null);
}

// Update UI headers & Profile with User state
function updateAuthUIState(user) {
  const userBtn = document.getElementById('header-user-btn');
  if (userBtn) {
    if (user) {
      userBtn.innerHTML = `<span>${user.avatar || '👨‍🌾'}</span>`;
      userBtn.title = `${user.name} (${user.role})`;
    } else {
      userBtn.innerHTML = `<span>🔑</span>`;
      userBtn.title = `Sign In / Register`;
    }
  }

  // Update Profile state
  if (user) {
    STATE.profile.farmerName = user.name;
    STATE.profile.phone = user.phone;
    STATE.profile.village = user.village;
    STATE.profile.district = user.district;
    STATE.profile.kvkCenter = user.kvkCenter;
  }

  if (window.renderProfileUI) window.renderProfileUI();
}

window.initAuthUI = initAuthUI;
window.showAuthModal = showAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.fillDemoAccount = fillDemoAccount;
window.handleLoginSubmit = handleLoginSubmit;
window.handleSignupSubmit = handleSignupSubmit;
window.handleSignOut = handleSignOut;

