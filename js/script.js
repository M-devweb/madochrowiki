const STORAGE_TEAM = 'madochrowiki_team';
const DATA_CHARS = 'data/characters.json';
const DATA_FAMILIERS = 'data/familiers.json';
const STORAGE_LANG = 'madochrowiki_lang';

let currentPage = 'home';
let currentLang = localStorage.getItem(STORAGE_LANG) || 'fr';
let characters = [];
let familiers = [];
let team = { characters: Array(9).fill(null), familiers: { extalia: null, celestial_spirit: null, dragon: null } };

let filterAttr = '';
let filterType = '';
let filterRarity = '';
let filterCategory = '';

const ATTRIBUTES = ['brave', 'mind', 'skill', 'intelligence'];
const TYPES = ['melee', 'ranged', 'defense', 'disrup', 'heal'];
const RARITIES = ['UR', 'SR', 'R', 'N'];
const FAMILIAR_RARITIES = ['UR', 'SR'];
const FAMILIAR_CATEGORIES = ['extalia', 'celestial_spirit', 'dragon'];

function attributeEmoji(attr) {
    const map = { brave: '🔴', mind: '🟡', skill: '🟢', intelligence: '🔵' };
    return map[attr] || '⚪';
}
function getAttrClass(attr) {
    const map = { brave: 'attr-brave', mind: 'attr-mind', skill: 'attr-skill', intelligence: 'attr-intelligence' };
    return map[attr] || 'attr-default';
}
function typeEmoji(type) {
    const t = (type || '').toLowerCase();
    const map = { melee: '👊', ranged: '🏹', defense: '🛡️', heal: '❤️', disrup: '🪄' };
    return map[t] || '';
}
function getTypeClass(type) { return 'type-' + (type || 'melee').toLowerCase(); }
function categoryEmoji(cat) {
    const map = { extalia: '🐱', celestial_spirit: '🔮', dragon: '🐉' };
    return map[cat] || '';
}
function getCategoryClass(cat) { return 'category-' + cat; }
function getRarityClass(rarity) { return 'rarity-' + (rarity || 'N'); }

// Traductions
const translations = {
    fr: {
        nav_home: 'Accueil', nav_characters: 'Tous les personnages',
        nav_lacrimas: 'Toutes les lacrimas', nav_familiers: 'Tous les Familiers',
        nav_story: 'Story Helper', nav_trial: 'Trial Helper', nav_setup: 'Setup Your Team',
        page_home: 'Accueil', page_characters: 'Tous les personnages',
        page_lacrimas: 'Toutes les lacrimas', page_familiers: 'Tous les Familiers',
        page_story: 'Story Helper', page_trial: 'Trial Helper', page_setup: 'Setup Your Team',
        welcome_title: 'Bienvenue sur MadochroWiki',
        welcome_subtitle: 'Votre encyclopédie interactive — choisissez votre langue',
        char_count: 'personnage(s)', lac_count: 'lacrima(s)', fam_count: 'familier(s)',
        no_characters: 'Aucun personnage pour le moment.',
        no_familiers: 'Aucun familier pour le moment.',
        no_lacrimas: 'Aucune lacrima enregistrée.',
        label_name: 'Nom', label_attribute: 'Attribut',
        label_type: 'Type', label_rarity: 'Rareté',
        label_spell1: 'Sort 1', label_spell2: 'Sort 2', label_spell3: 'Sort 3',
        label_lacrima: 'Lacrima', label_lacrima_effect: 'Effet de la lacrima',
        label_effect: 'Effet', label_category: 'Catégorie',
        btn_close: 'Fermer',
        filter_all: 'Tous', filter_attribute: 'Attribut', filter_type: 'Type', filter_rarity: 'Rareté',
        filter_category: 'Catégorie',
        profile_spells: 'Sorts', profile_lacrima: 'Lacrima',
        team_character_slot: 'Emplacement personnage',
        select_character: 'Sélectionner un personnage',
        select_familiar: 'Sélectionner un familier',
        ph_story_title: 'Story Helper', ph_story_desc: 'Outil d\'aide au scénario — à venir.',
        ph_trial_title: 'Trial Helper', ph_trial_desc: 'Assistant pour les épreuves — en développement.',
        ph_setup_title: 'Setup Your Team', ph_setup_desc: 'Composez votre équipe idéale.',
        or_text: 'ou',
        attr_brave: 'Brave', attr_mind: 'Mind', attr_skill: 'Skill', attr_intelligence: 'Intelligence',
        lacrima_effect_label: 'Effet',
        category_extalia: 'Extalia',
        category_celestial_spirit: 'Celestial Spirit',
        category_dragon: 'Dragon',
        remove: 'Retirer'
    },
    en: {
        nav_home: 'Home', nav_characters: 'All Characters',
        nav_lacrimas: 'All Lacrimas', nav_familiers: 'All Familiars',
        nav_story: 'Story Helper', nav_trial: 'Trial Helper', nav_setup: 'Setup Your Team',
        page_home: 'Home', page_characters: 'All Characters',
        page_lacrimas: 'All Lacrimas', page_familiers: 'All Familiars',
        page_story: 'Story Helper', page_trial: 'Trial Helper', page_setup: 'Setup Your Team',
        welcome_title: 'Welcome to MadochroWiki',
        welcome_subtitle: 'Your interactive encyclopedia — choose your language',
        char_count: 'character(s)', lac_count: 'lacrima(s)', fam_count: 'familiar(s)',
        no_characters: 'No characters yet.', no_familiers: 'No familiars yet.',
        no_lacrimas: 'No lacrimas found.',
        label_name: 'Name', label_attribute: 'Attribute',
        label_type: 'Type', label_rarity: 'Rarity',
        label_spell1: 'Spell 1', label_spell2: 'Spell 2', label_spell3: 'Spell 3',
        label_lacrima: 'Lacrima', label_lacrima_effect: 'Lacrima effect',
        label_effect: 'Effect', label_category: 'Category',
        btn_close: 'Close',
        filter_all: 'All', filter_attribute: 'Attribute', filter_type: 'Type', filter_rarity: 'Rarity',
        filter_category: 'Category',
        profile_spells: 'Spells', profile_lacrima: 'Lacrima',
        team_character_slot: 'Character slot',
        select_character: 'Select a character',
        select_familiar: 'Select a familiar',
        ph_story_title: 'Story Helper', ph_story_desc: 'Story assistance tool — coming soon.',
        ph_trial_title: 'Trial Helper', ph_trial_desc: 'Trial assistant — under development.',
        ph_setup_title: 'Setup Your Team', ph_setup_desc: 'Build your ideal team.',
        or_text: 'or',
        attr_brave: 'Brave', attr_mind: 'Mind', attr_skill: 'Skill', attr_intelligence: 'Intelligence',
        lacrima_effect_label: 'Effect',
        category_extalia: 'Extalia',
        category_celestial_spirit: 'Celestial Spirit',
        category_dragon: 'Dragon',
        remove: 'Remove'
    },
    jp: {
        nav_home: 'ホーム', nav_characters: '全キャラクター',
        nav_lacrimas: '全ラクリマ', nav_familiers: '全ファミリア',
        nav_story: 'ストーリーヘルパー', nav_trial: 'トライアルヘルパー', nav_setup: 'チーム編成',
        page_home: 'ホーム', page_characters: '全キャラクター',
        page_lacrimas: '全ラクリマ', page_familiers: '全ファミリア',
        page_story: 'ストーリーヘルパー', page_trial: 'トライアルヘルパー', page_setup: 'チーム編成',
        welcome_title: 'MadochroWikiへようこそ',
        welcome_subtitle: 'インタラクティブ百科事典 — 言語を選択してください',
        char_count: 'キャラクター', lac_count: 'ラクリマ', fam_count: 'ファミリア',
        no_characters: 'まだキャラクターがいません。', no_familiers: 'まだファミリアがいません。',
        no_lacrimas: 'ラクリマが見つかりません。',
        label_name: '名前', label_attribute: '属性',
        label_type: 'タイプ', label_rarity: 'レアリティ',
        label_spell1: 'スペル 1', label_spell2: 'スペル 2', label_spell3: 'スペル 3',
        label_lacrima: 'ラクリマ', label_lacrima_effect: 'ラクリマ効果',
        label_effect: '効果', label_category: 'カテゴリー',
        btn_close: '閉じる',
        filter_all: '全て', filter_attribute: '属性', filter_type: 'タイプ', filter_rarity: 'レアリティ',
        filter_category: 'カテゴリー',
        profile_spells: 'スペル', profile_lacrima: 'ラクリマ',
        team_character_slot: 'キャラスロット',
        select_character: 'キャラクターを選択',
        select_familiar: 'ファミリアを選択',
        ph_story_title: 'ストーリーヘルパー', ph_story_desc: 'シナリオ補助ツール — 近日公開。',
        ph_trial_title: 'トライアルヘルパー', ph_trial_desc: '試練アシスタント — 開発中。',
        ph_setup_title: 'チーム編成', ph_setup_desc: '理想のチームを構築。',
        or_text: 'または',
        attr_brave: '勇敢', attr_mind: '精神', attr_skill: '技術', attr_intelligence: '知性',
        lacrima_effect_label: '効果',
        category_extalia: 'エクスタリア',
        category_celestial_spirit: '天霊',
        category_dragon: 'ドラゴン',
        remove: '削除'
    }
};

function t(key) { return (translations[currentLang] && translations[currentLang][key]) || key; }
function translateAttribute(attrKey) { return t('attr_' + (attrKey || '').toLowerCase()) || attrKey; }

// Normalisation insensible à la casse
function normalizeCharacter(c) {
    return {
        ...c,
        attribute: (c.attribute || 'brave').toLowerCase(),
        type: (c.type || 'melee').toLowerCase(),
        rarity: (c.rarity || 'N').toUpperCase()
    };
}
function normalizeFamiliar(f) {
    return {
        ...f,
        category: (f.category || 'extalia').toLowerCase(),
        rarity: (f.rarity || 'SR').toUpperCase()
    };
}

async function loadData() {
    try {
        const [cResp, fResp] = await Promise.all([
            fetch(DATA_CHARS),
            fetch(DATA_FAMILIERS)
        ]);
        if (cResp.ok) characters = (await cResp.json()).map(normalizeCharacter);
        else throw new Error('characters.json not accessible');
        if (fResp.ok) familiers = (await fResp.json()).map(normalizeFamiliar);
        else throw new Error('familiers.json not accessible');
    } catch (e) {
        const localChars = localStorage.getItem('madochrowiki_characters');
        characters = localChars ? JSON.parse(localChars).map(normalizeCharacter) : getDefaultCharacters();
        const localFams = localStorage.getItem('madochrowiki_familiers');
        familiers = localFams ? JSON.parse(localFams).map(normalizeFamiliar) : getDefaultFamiliers();
    }
    const savedTeam = localStorage.getItem(STORAGE_TEAM);
    team = savedTeam ? JSON.parse(savedTeam) : { characters: Array(9).fill(null), familiers: { extalia: null, celestial_spirit: null, dragon: null } };
}

function getDefaultCharacters() {
    return [
        { id: 'char_1', name: 'Akira Hayashi', attribute: 'brave', type: 'melee', rarity: 'UR', photo: '', spell1: '[color=red]Boule de Feu[/color]', spell2: 'Muraille Incandescente', spell3: '[color=orange]Colère du Dragon[/color]', lacrima: 'Lacrima de Flamme', lacrima_effect: 'Augmente la puissance de feu de 25%' },
        { id: 'char_2', name: 'Yuki Mizuhara', attribute: 'intelligence', type: 'ranged', rarity: 'SR', photo: '', spell1: '[color=blue]Vague Tourbillonnante[/color]', spell2: 'Pluie de Glace', spell3: 'Étreinte Abyssale', lacrima: 'Lacrima de Marée', lacrima_effect: 'Régénération de PV pendant 3 tours' }
    ];
}
function getDefaultFamiliers() {
    return [
        { id: 'fam_1', name: 'Ignis', category: 'extalia', rarity: 'UR', photo: '', effect: 'Augmente l\'attaque de 20%' },
        { id: 'fam_2', name: 'Sylph', category: 'celestial_spirit', rarity: 'SR', photo: '', effect: 'Soigne 10% PV par tour' },
        { id: 'fam_3', name: 'Drakon', category: 'dragon', rarity: 'UR', photo: '', effect: 'Inflige Brûlure' }
    ];
}

function saveTeam() { localStorage.setItem(STORAGE_TEAM, JSON.stringify(team)); }
function parseColorTags(text) { if (!text) return ''; return text.replace(/\[color=([^\]]+)\](.*?)\[\/color\]/gi, (_, c, t) => `<span style="color:${c}">${t}</span>`); }
function escapeHtml(str) { if (!str) return ''; const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

// Navigation
function navigateTo(page) {
    currentPage = page;
    document.querySelectorAll('#sidebarNav li').forEach(li => li.classList.toggle('active', li.dataset.page === page));
    window.location.hash = page === 'home' ? '' : '#/' + page;
    renderPage();
    updateAllTranslations();
    closeSidebar();
    document.getElementById('contentArea').scrollTop = 0;
}
function checkRoute() {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
        const valid = ['characters','lacrimas','familiers','story','trial','setup'];
        currentPage = valid.includes(hash.replace('#/','')) ? hash.replace('#/','') : 'home';
    } else currentPage = 'home';
    document.querySelectorAll('#sidebarNav li').forEach(li => li.classList.toggle('active', li.dataset.page === currentPage));
    renderPage();
    updateAllTranslations();
}
function updateAllTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => { const key = el.getAttribute('data-i18n'); if (key) el.textContent = t(key); });
    const titles = { home:'page_home', characters:'page_characters', lacrimas:'page_lacrimas', familiers:'page_familiers', story:'page_story', trial:'page_trial', setup:'page_setup' };
    document.getElementById('pageTitle').textContent = t(titles[currentPage]||'page_home');
    document.title = 'MadochroWiki - ' + t(titles[currentPage]||'page_home');
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === currentLang));
}
function setLanguage(lang) { currentLang = lang; localStorage.setItem(STORAGE_LANG, lang); updateAllTranslations(); renderPage(); }

// Rendu
function renderPage() {
    const area = document.getElementById('contentArea');
    switch (currentPage) {
        case 'home': area.innerHTML = renderHome(); break;
        case 'characters': area.innerHTML = renderCharactersPage(); break;
        case 'lacrimas': area.innerHTML = renderLacrimasPage(); break;
        case 'familiers': area.innerHTML = renderFamiliersPage(); break;
        case 'story': area.innerHTML = renderPlaceholder('story','📜','ph_story_title','ph_story_desc'); break;
        case 'trial': area.innerHTML = renderPlaceholder('trial','⚔️','ph_trial_title','ph_trial_desc'); break;
        case 'setup': area.innerHTML = renderSetupPage(); break;
    }
    updateAllTranslations();
    bindEvents();
}

function renderHome() {
    return `<div class="welcome-section"><h1>${t('welcome_title')}</h1><p class="subtitle">${t('welcome_subtitle')}</p><div class="welcome-lang-buttons"><button class="welcome-lang-btn${currentLang==='fr'?' active-welcome':''}" onclick="setLanguage('fr')">🇫🇷 Français</button><button class="welcome-lang-btn${currentLang==='en'?' active-welcome':''}" onclick="setLanguage('en')">🇬🇧 English</button><button class="welcome-lang-btn${currentLang==='jp'?' active-welcome':''}" onclick="setLanguage('jp')">🇯🇵 日本語</button></div></div>`;
}

function renderFilters(type) {
    const attrOpts = ATTRIBUTES.map(a => `<option value="${a}" ${filterAttr===a?'selected':''}>${attributeEmoji(a)} ${translateAttribute(a)}</option>`).join('');
    const typeOpts = TYPES.map(t => `<option value="${t}" ${filterType===t?'selected':''}>${typeEmoji(t)} ${t.charAt(0).toUpperCase() + t.slice(1)}</option>`).join('');
    const rarityOpts = RARITIES.map(r => `<option value="${r}" ${filterRarity===r?'selected':''}>${r}</option>`).join('');
    const famRarityOpts = FAMILIAR_RARITIES.map(r => `<option value="${r}" ${filterRarity===r?'selected':''}>${r}</option>`).join('');
    const catOpts = FAMILIAR_CATEGORIES.map(c => `<option value="${c}" ${filterCategory===c?'selected':''}>${categoryEmoji(c)} ${t('category_'+c)}</option>`).join('');
    if (type === 'characters') {
        return `<div class="filters"><select id="filterAttr"><option value="">${t('filter_all')} ${t('filter_attribute')}</option>${attrOpts}</select><select id="filterType"><option value="">${t('filter_all')} ${t('filter_type')}</option>${typeOpts}</select><select id="filterRarity"><option value="">${t('filter_all')} ${t('filter_rarity')}</option>${rarityOpts}</select></div>`;
    } else if (type === 'familiers') {
        return `<div class="filters"><select id="filterCategory"><option value="">${t('filter_all')} ${t('filter_category')}</option>${catOpts}</select><select id="filterRarity"><option value="">${t('filter_all')} ${t('filter_rarity')}</option>${famRarityOpts}</select></div>`;
    }
    return '';
}

function getFilteredCharacters() {
    return characters.filter(c => (!filterAttr||c.attribute===filterAttr) && (!filterType||c.type===filterType) && (!filterRarity||c.rarity===filterRarity));
}
function getFilteredFamiliers() {
    return familiers.filter(f => (!filterCategory||f.category===filterCategory) && (!filterRarity||f.rarity===filterRarity));
}

function renderCharactersPage() {
    if (!characters.length) return `<div class="section-header"><h2>${t('page_characters')}</h2></div><p style="text-align:center;padding:40px;">${t('no_characters')}</p>`;
    const filtered = getFilteredCharacters();
    let cards = '';
    filtered.forEach(c => {
        const attrClass = getAttrClass(c.attribute);
        const typeClass = getTypeClass(c.type);
        const rarityClass = getRarityClass(c.rarity); // ex: rarity-UR
        cards += `<div class="char-card" onclick="showCharacterProfile('${c.id}')">
            <div class="card-img">
                ${c.photo ? `<img src="${escapeHtml(c.photo)}" alt="${escapeHtml(c.name)}">` : '<span class="placeholder-icon">👤</span>'}
                <span class="rarity-badge-top ${rarityClass}-top">${escapeHtml(c.rarity)}</span>
            </div>
            <div class="card-body">
                <div class="card-name">${escapeHtml(c.name)}</div>
                <div class="card-attr">
                    <span class="attr-badge ${attrClass}">${attributeEmoji(c.attribute)} ${escapeHtml(translateAttribute(c.attribute))}</span>
                    <span class="type-badge ${typeClass}">${typeEmoji(c.type)} ${escapeHtml(c.type.charAt(0).toUpperCase() + c.type.slice(1))}</span>
                </div>
            </div>
        </div>`;
    });
    return `<div class="section-header"><h2>${t('page_characters')}</h2><span class="char-count">${filtered.length}/${characters.length} ${t('char_count')}</span></div>${renderFilters('characters')}<div class="char-grid">${cards}</div>`;
}

function renderLacrimasPage() {
    if (!characters.length) return `<div class="section-header"><h2>${t('page_lacrimas')}</h2></div><p style="text-align:center;padding:40px;">${t('no_lacrimas')}</p>`;
    let cards = '';
    characters.forEach(c => {
        const lacName = c.lacrima || `Lacrima de ${c.name}`;
        cards += `<div class="char-card" onclick="showLacrimaInfo('${c.id}')"><div class="card-img" style="background:#1a1a35;"><span style="font-size:4rem;">💎</span></div><div class="card-body"><div class="card-name">${parseColorTags(escapeHtml(lacName))}</div><div class="card-attr"><span class="attr-badge attr-default">${escapeHtml(c.name)}</span></div></div></div>`;
    });
    return `<div class="section-header"><h2>${t('page_lacrimas')}</h2><span class="char-count">${characters.length} ${t('lac_count')}</span></div><div class="char-grid">${cards}</div>`;
}

function renderFamiliersPage() {
    if (!familiers.length) return `<div class="section-header"><h2>${t('page_familiers')}</h2></div><p style="text-align:center;padding:40px;">${t('no_familiers')}</p>`;
    const filtered = getFilteredFamiliers();
    let cards = '';
    filtered.forEach(f => {
        const catClass = getCategoryClass(f.category);
        const rarityClass = getRarityClass(f.rarity);
        cards += `<div class="char-card familiar-card" onclick="showFamiliarInfo('${f.id}')">
            <div class="card-img">
                ${f.photo ? `<img src="${escapeHtml(f.photo)}" alt="${escapeHtml(f.name)}">` : '<span class="placeholder-icon">🐾</span>'}
                <span class="rarity-badge-top ${rarityClass}-top">${escapeHtml(f.rarity)}</span>
            </div>
            <div class="card-body">
                <div class="card-name">${escapeHtml(f.name)}</div>
                <div class="familiar-category">
                    <span class="category-badge ${catClass}">${categoryEmoji(f.category)} ${t('category_'+f.category)}</span>
                </div>
            </div>
        </div>`;
    });
    return `<div class="section-header"><h2>${t('page_familiers')}</h2><span class="char-count">${filtered.length}/${familiers.length} ${t('fam_count')}</span></div>${renderFilters('familiers')}<div class="char-grid">${cards}</div>`;
}

function renderSetupPage() {
    let charSlots = '';
    for (let i = 0; i < 9; i++) {
        const cId = team.characters[i];
        const char = characters.find(c => c.id === cId);
        charSlots += `<div class="team-slot" onclick="openCharacterSelector(${i})">${char ? `<img src="${escapeHtml(char.photo)}" alt="${escapeHtml(char.name)}"><button class="remove-slot" onclick="event.stopPropagation(); removeCharacterFromSlot(${i})">✕</button>` : '<span class="slot-placeholder">+</span>'}</div>`;
    }
    const famKeys = ['extalia', 'celestial_spirit', 'dragon'];
    let famSlots = '';
    famKeys.forEach(key => {
        const famId = team.familiers[key];
        const fam = familiers.find(f => f.id === famId);
        famSlots += `<div class="team-slot" onclick="openFamiliarSelector('${key}')">${fam ? `<img src="${escapeHtml(fam.photo)}" alt="${escapeHtml(fam.name)}"><button class="remove-slot" onclick="event.stopPropagation(); removeFamiliarFromSlot('${key}')">✕</button>` : '<span class="slot-placeholder">+</span>'}</div>`;
    });
    return `<div class="section-header"><h2>${t('page_setup')}</h2></div><div class="team-setup"><div><h3>Personnages</h3><div class="team-characters">${charSlots}</div></div><div><h3>Familiers</h3><div class="team-familiers">${famSlots}</div></div></div>`;
}

function renderPlaceholder(page, icon, titleKey, descKey) {
    return `<div class="placeholder-page"><div class="ph-icon">${icon}</div><h3>${t(titleKey)}</h3><p>${t(descKey)}</p></div>`;
}

// Modales
function openModal(html) { document.getElementById('modalContainer').innerHTML = `<div class="modal-overlay" onclick="closeModal(event)"><div class="modal" onclick="event.stopPropagation()">${html}</div></div>`; document.body.style.overflow = 'hidden'; }
function closeModal(event) { if (event && event.target !== document.querySelector('.modal-overlay')) return; document.getElementById('modalContainer').innerHTML = ''; document.body.style.overflow = ''; }

function showCharacterProfile(charId) {
    const c = characters.find(ch => ch.id === charId);
    if (!c) return;
    const attrClass = getAttrClass(c.attribute);
    const typeClass = getTypeClass(c.type);
    const rarityClass = getRarityClass(c.rarity);
    const lacName = c.lacrima || `Lacrima de ${c.name}`;
    const lacEffect = c.lacrima_effect || '-';
    openModal(`<div class="profile-modal">
        <div class="profile-img">${c.photo ? `<img src="${escapeHtml(c.photo)}">` : '<span>👤</span>'}</div>
        <div class="profile-name">${escapeHtml(c.name)}</div>
        <div class="profile-attr">
            <span class="attr-badge ${attrClass}">${attributeEmoji(c.attribute)} ${escapeHtml(translateAttribute(c.attribute))}</span>
            <span class="type-badge ${typeClass}">${typeEmoji(c.type)} ${escapeHtml(c.type.charAt(0).toUpperCase() + c.type.slice(1))}</span>
            <span class="rarity-badge-top ${rarityClass}-top" style="position:static;width:auto;height:auto;border-radius:20px;padding:3px 10px;">${escapeHtml(c.rarity)}</span>
        </div>
        <div class="profile-details">
            <div class="detail-row"><span class="detail-label">🔮 ${t('profile_spells')}</span><span class="detail-value"></span></div>
            <div class="detail-row"><span class="detail-label">  ${t('label_spell1')}</span><span class="detail-value">${parseColorTags(escapeHtml(c.spell1||'-'))}</span></div>
            <div class="detail-row"><span class="detail-label">  ${t('label_spell2')}</span><span class="detail-value">${parseColorTags(escapeHtml(c.spell2||'-'))}</span></div>
            <div class="detail-row"><span class="detail-label">  ${t('label_spell3')}</span><span class="detail-value">${parseColorTags(escapeHtml(c.spell3||'-'))}</span></div>
            <div class="detail-row"><span class="detail-label">💎 ${t('profile_lacrima')}</span><span class="detail-value">${parseColorTags(escapeHtml(lacName))}</span></div>
            <div class="detail-row"><span class="detail-label">✨ ${t('lacrima_effect_label')}</span><span class="detail-value">${parseColorTags(escapeHtml(lacEffect))}</span></div>
        </div>
        <button class="btn btn-cancel" onclick="closeModal()">${t('btn_close')}</button>
    </div>`);
}
function showLacrimaInfo(charId) {
    const c = characters.find(ch => ch.id === charId);
    if (!c) return;
    const lacName = c.lacrima || `Lacrima de ${c.name}`;
    const lacEffect = c.lacrima_effect || '-';
    openModal(`<div class="profile-modal"><div style="font-size:3rem;">💎</div><div class="profile-name">${parseColorTags(escapeHtml(lacName))}</div><p style="color:var(--text-muted);">${escapeHtml(c.name)}</p><div class="profile-details"><div class="detail-row"><span class="detail-label">✨ ${t('lacrima_effect_label')}</span><span class="detail-value">${parseColorTags(escapeHtml(lacEffect))}</span></div></div><button class="btn btn-cancel" onclick="closeModal()">${t('btn_close')}</button></div>`);
}
function showFamiliarInfo(famId) {
    const f = familiers.find(f => f.id === famId);
    if (!f) return;
    const catClass = getCategoryClass(f.category);
    const rarityClass = getRarityClass(f.rarity);
    openModal(`<div class="profile-modal"><div class="profile-img">${f.photo ? `<img src="${escapeHtml(f.photo)}">` : '<span>🐾</span>'}</div><div class="profile-name">${escapeHtml(f.name)}</div><div class="profile-attr"><span class="category-badge ${catClass}">${categoryEmoji(f.category)} ${t('category_'+f.category)}</span><span class="rarity-badge-top ${rarityClass}-top" style="position:static;width:auto;height:auto;border-radius:20px;padding:3px 10px;">${escapeHtml(f.rarity)}</span></div><div class="profile-details"><div class="detail-row"><span class="detail-label">✨ ${t('label_effect')}</span><span class="detail-value">${parseColorTags(escapeHtml(f.effect))}</span></div></div><button class="btn btn-cancel" onclick="closeModal()">${t('btn_close')}</button></div>`);
}

// Sélection d'équipe
function openCharacterSelector(slotIndex) {
    const list = characters.map(c => `<div class="char-card" style="margin:5px;padding:10px;cursor:pointer;" onclick="assignCharacterToSlot(${slotIndex},'${c.id}')"><div class="card-img" style="height:80px;">${c.photo?`<img src="${escapeHtml(c.photo)}">`:'👤'}</div><div class="card-name">${escapeHtml(c.name)}</div></div>`).join('');
    openModal(`<h3>${t('select_character')}</h3><div style="max-height:300px;overflow-y:auto;display:flex;flex-wrap:wrap;">${list}</div>`);
}
function openFamiliarSelector(categoryKey) {
    const fams = familiers.filter(f => f.category === categoryKey);
    const list = fams.map(f => `<div class="char-card" style="margin:5px;padding:10px;cursor:pointer;" onclick="assignFamiliarToSlot('${categoryKey}','${f.id}')"><div class="card-img" style="height:80px;">${f.photo?`<img src="${escapeHtml(f.photo)}">`:'🐾'}</div><div class="card-name">${escapeHtml(f.name)}</div></div>`).join('');
    openModal(`<h3>${t('select_familiar')} (${t('category_'+categoryKey)})</h3><div style="max-height:300px;overflow-y:auto;display:flex;flex-wrap:wrap;">${list}</div>`);
}
function assignCharacterToSlot(index, charId) { team.characters[index] = charId; saveTeam(); closeModal(); renderPage(); }
function assignFamiliarToSlot(catKey, famId) { team.familiers[catKey] = famId; saveTeam(); closeModal(); renderPage(); }
function removeCharacterFromSlot(index) { team.characters[index] = null; saveTeam(); renderPage(); }
function removeFamiliarFromSlot(key) { team.familiers[key] = null; saveTeam(); renderPage(); }

// Événements filtres
function bindEvents() {
    document.getElementById('filterAttr')?.addEventListener('change', e => { filterAttr = e.target.value; renderPage(); });
    document.getElementById('filterType')?.addEventListener('change', e => { filterType = e.target.value; renderPage(); });
    document.getElementById('filterRarity')?.addEventListener('change', e => { filterRarity = e.target.value; renderPage(); });
    document.getElementById('filterCategory')?.addEventListener('change', e => { filterCategory = e.target.value; renderPage(); });
}

// Sidebar mobile
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); document.getElementById('sidebarOverlay').classList.toggle('active'); }
function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('sidebarOverlay').classList.remove('active'); }

window.navigateTo = navigateTo;
window.setLanguage = setLanguage;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.showCharacterProfile = showCharacterProfile;
window.showLacrimaInfo = showLacrimaInfo;
window.showFamiliarInfo = showFamiliarInfo;
window.openCharacterSelector = openCharacterSelector;
window.openFamiliarSelector = openFamiliarSelector;
window.assignCharacterToSlot = assignCharacterToSlot;
window.assignFamiliarToSlot = assignFamiliarToSlot;
window.removeCharacterFromSlot = removeCharacterFromSlot;
window.removeFamiliarFromSlot = removeFamiliarFromSlot;
window.closeModal = closeModal;

window.addEventListener('hashchange', checkRoute);
document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('sidebarOverlay');
    if (overlay) overlay.addEventListener('click', closeSidebar);
    loadData().then(() => {
        setLanguage(currentLang);
        checkRoute();
    });
});