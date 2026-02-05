# Database Schema

SQLite database: `public/data/horoscope.db`

## Tables

### astrology_systems
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| code | TEXT UNIQUE NOT NULL |
| created_at | TEXT |

### signs
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| system_id | INTEGER NOT NULL |
| slug | TEXT UNIQUE NOT NULL |
| element_code | TEXT |
| image_url | TEXT |
| created_at | TEXT |

### sign_translations
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| sign_id | INTEGER NOT NULL |
| lang | TEXT NOT NULL |
| name | TEXT |
| description | TEXT |

### elements
| Column | Type |
|--------|------|
| code | TEXT PRIMARY KEY |
| created_at | TEXT |

### element_translations
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| element_code | TEXT NOT NULL |
| lang | TEXT NOT NULL |
| name | TEXT |
| keywords | TEXT (JSON array) |
| balance | TEXT |
| imbalance | TEXT |

### element_tips
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| element_code | TEXT NOT NULL |
| lang | TEXT NOT NULL |
| tip | TEXT |

### compatibility
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| sign_id | INTEGER NOT NULL |
| other_sign_id | INTEGER NOT NULL |
| relation_type | TEXT NOT NULL |

### compatibility_translations
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| compatibility_id | INTEGER NOT NULL |
| lang | TEXT NOT NULL |
| description | TEXT |

### tarot_suits
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| slug | TEXT UNIQUE |
| created_at | TEXT |

### tarot_suit_translations
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| suit_id | INTEGER |
| lang | TEXT |
| name | TEXT |

### tarot_meanings
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| sign_id | INTEGER NOT NULL |
| lang | TEXT NOT NULL |
| upright | TEXT |
| reversed | TEXT |

### zodiac_calendar_entries
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| sign_id | INTEGER NOT NULL |
| month | INTEGER NOT NULL |
| status | TEXT NOT NULL |
| element | TEXT |
| sign | TEXT |
| description | TEXT |
| lang | TEXT NOT NULL |

### forecasts (reserved)
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| sign_id | INTEGER NOT NULL |
| type_code | TEXT NOT NULL |
| date | TEXT |
| month | INTEGER |
| year | INTEGER |
| love_score | INTEGER |
| career_score | INTEGER |
| emotion_score | INTEGER |
| energy_score | INTEGER |

### forecast_translations (reserved)
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| forecast_id | INTEGER NOT NULL |
| lang | TEXT NOT NULL |
| summary | TEXT |

### lucky_attributes (reserved)
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| forecast_id | INTEGER NOT NULL |
| numbers | TEXT |
| color | TEXT |
| direction | TEXT |
| hours | TEXT |

### traits (reserved)
| Column | Type |
|--------|------|
| id | TEXT PRIMARY KEY |
| category | TEXT |
| emoji | TEXT |

### trait_translations (reserved)
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| trait_id | TEXT NOT NULL |
| lang | TEXT NOT NULL |
| name | TEXT |
| description | TEXT |

### actions
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| forecast_id | INTEGER NOT NULL |
| type | TEXT NOT NULL ('do' or 'avoid') |

### action_translations
| Column | Type |
|--------|------|
| id | INTEGER PRIMARY KEY |
| action_id | INTEGER NOT NULL |
| lang | TEXT NOT NULL |
| content | TEXT |

## Supported Languages
`en`, `ja`, `ko`, `vi`
