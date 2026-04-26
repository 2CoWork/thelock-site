// ════════════════════════════════════════
//  THE LOCK · AUTH SYSTEM
//  Inclure ce script sur toutes les pages
// ════════════════════════════════════════

var TL = {

  // ── GET / SET USER ──
  getUser: function(){
    try{ return JSON.parse(localStorage.getItem('thelock_user') || 'null'); }
    catch(e){ return null; }
  },

  setUser: function(data){
    try{ localStorage.setItem('thelock_user', JSON.stringify(data)); } catch(e){}
  },

  logout: function(){
    try{ localStorage.removeItem('thelock_user'); } catch(e){}
    window.location.href = 'index.html';
  },

  // ── CHECK IF LOGGED IN ──
  // Call on every protected page
  requireAuth: function(){
    var user = this.getUser();
    if(!user || !user.loggedIn){
      window.location.href = 'index.html?auth=1';
      return false;
    }
    return user;
  },

  // ── APPLY USER TO PAGE ──
  applyToPage: function(){
    var user = this.getUser();
    if(!user) return;
    // Topbar profile button
    var tb = document.querySelector('.tb-profile');
    if(tb) tb.textContent = user.pseudo.toUpperCase();
    // Avatar colors
    if(window.av){
      if(user.skin) av.skin = user.skin;
      if(user.hair) av.hair = user.hair;
      if(user.eye)  av.eye  = user.eye;
    }
  },

  // ── REGISTER ──
  register: function(data){
    var existing = this.getUser();
    var users = this.getAllUsers();
    // Check if pseudo already taken
    var taken = users.some(function(u){ return u.pseudo.toLowerCase() === data.pseudo.toLowerCase(); });
    if(taken) return {ok:false, err:'Ce pseudo est deja pris'};
    var user = {
      pseudo:     data.pseudo,
      mail:       data.mail,
      pass:       data.pass,
      age:        data.age,
      gender:     data.gender || 'M',
      skin:       data.skin || '#C68642',
      hair:       data.hair || '#1a1a1a',
      eye:        data.eye  || '#00d4ff',
      postes:     data.postes || [],
      role:       data.role || 'Joueur',
      capa1:      data.capa1 || '',
      capa2:      data.capa2 || '',
      level:      'RECRUE',
      xp:         0,
      lc:         500,
      valeur:     1000,
      followers:  0,
      buts:       0,
      assists:    0,
      note:       0,
      presences:  0,
      loggedIn:   true,
      createdAt:  new Date().toISOString()
    };
    users.push(user);
    this.saveAllUsers(users);
    this.setUser(user);
    return {ok:true, user:user};
  },

  // ── LOGIN ──
  login: function(pseudo, pass){
    var users = this.getAllUsers();
    var user = users.find(function(u){
      return u.pseudo.toLowerCase() === pseudo.toLowerCase() && u.pass === pass;
    });
    if(!user) return {ok:false, err:'Pseudo ou mot de passe incorrect'};
    user.loggedIn = true;
    this.setUser(user);
    return {ok:true, user:user};
  },

  // ── ALL USERS (multi-account on same device) ──
  getAllUsers: function(){
    try{ return JSON.parse(localStorage.getItem('thelock_all_users') || '[]'); }
    catch(e){ return []; }
  },

  saveAllUsers: function(users){
    try{ localStorage.setItem('thelock_all_users', JSON.stringify(users)); } catch(e){}
  }
};
