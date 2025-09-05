# 🏆 DHL IT Lockdown Tournament - I Love IT 2025

A competitive escape room tournament game designed for 1000+ DHL employees worldwide. Players compete in "The IT Lockdown" challenge to win prizes and glory!

## 🎮 Tournament Features

- **🏁 Competitive Scoring**: 1-minute perfect run system with penalties
- **📱 Mobile & Desktop**: Responsive design for QR codes and direct URLs  
- **🏆 Real-time Leaderboard**: Live tournament tracking
- **👑 Winner Determination**: Automatic top 3 identification
- **📊 Admin Dashboard**: Complete tournament management
- **🔄 Backup Strategy**: Dual localStorage + cloud database
- **🌐 Public Hosting**: Vercel deployment ready

## 🚀 Quick Start

### Development Setup

```sh
npm install
npm run dev
```

### Production Build

```sh
npm run build
npm run preview
```

### Tournament Deployment

1. Push to Git repository
2. Deploy to Vercel with KV database
3. Generate QR codes for mobile players
4. Launch tournament!

## 🎯 Tournament URLs

- **Game**: `/` - Main tournament game
- **Leaderboard**: `/leaderboard` - Live rankings  
- **Admin**: `/admin.html` - Tournament management
- **API**: `/api/submit-score` - Score submission

## 🏆 Admin Access

- **Password**: `DHL2025Admin!`
- **Dashboard**: Export CSV, view all players, determine winners
- **Real-time**: Monitor tournament progress live

## 📊 Tournament Scoring

- **100 points**: Perfect run (≤60 seconds, 0 wrong answers)
- **-10 points**: Each extra minute over 60 seconds  
- **-5 points**: Each wrong answer
- **-2 points**: Each hint used

## 🛠️ Tech Stack

- **Frontend**: Vue 3 + TypeScript + TailwindCSS
- **Backend**: Vercel Serverless Functions
- **Database**: Vercel KV (Redis)
- **Hosting**: Vercel (Free tier supports 1000+ players)

## 🎪 Tournament Ready!

This system is ready for professional corporate tournaments with:
- ✅ 1000+ simultaneous players
- ✅ Automatic winner determination  
- ✅ Mobile QR code scanning
- ✅ Real-time leaderboards
- ✅ Complete admin dashboard
- ✅ CSV export for prize distribution

---

**Built for DHL I Love IT 2025 Tournament** 🚛💙
