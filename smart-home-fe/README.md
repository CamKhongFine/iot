# Smart Home Web UI

A production-ready Smart Home IoT dashboard built with React, TypeScript, and Material UI.

## 🎯 Features

- ✅ **Clean Login Interface** - Simple email/password authentication
- ✅ **Dashboard** - Glanceable room status cards
- ✅ **Light Control** - Primary interaction with optimistic UI
- ✅ **Sensor Monitoring** - Temperature, humidity, motion, door sensors
- ✅ **Fire Alerts** - Critical alert highlighting
- ✅ **Room Details** - Telemetry charts (24h history)
- ✅ **Dark Mode** - Theme toggle with localStorage persistence
- ✅ **Mobile Responsive** - Works on all screen sizes

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:5173**

### Build for Production

```bash
npm run build
```

## 🎨 Design Principles

### IoT UX Hierarchy

1. **Light Control** - PRIMARY action, always prominent
2. **Fire Alerts** - CRITICAL, immediate attention
3. **Temperature & Humidity** - MAIN context
4. **Motion & Door** - SECONDARY context

### Color Scheme

- **Green** (#4caf50) - OK, ON, Normal
- **Yellow** (#ff9800) - Warning, Abnormal
- **Red** (#f44336) - Fire, Critical, Offline

### Glanceable Design

- User understands status in < 2 seconds
- Clear visual hierarchy
- Minimal clicks required
- Optimistic UI for instant feedback

## 📁 Project Structure

```
src/
├── api/
│   └── client.ts          # API client with mock data
├── components/
│   ├── RoomCard.tsx       # Room status card
│   ├── LightSwitch.tsx    # Light control (PRIMARY)
│   ├── SensorChip.tsx     # Sensor status indicators
│   └── AlertBanner.tsx    # Critical alerts
├── pages/
│   ├── Login.tsx          # Authentication page
│   ├── Dashboard.tsx      # Main dashboard
│   └── RoomDetail.tsx     # Room detail with charts
├── context/
│   └── AuthContext.tsx    # Authentication state
├── theme/
│   └── theme.ts           # Material UI theme
├── types/
│   └── index.ts           # TypeScript definitions
├── App.tsx                # Main app with routing
└── main.tsx               # Entry point
```

## 🔐 Authentication

### Demo Mode

Currently using mock authentication. Any email/password combination will work.

**Example:**
- Email: `demo@example.com`
- Password: `password`

### Backend Integration

To connect to real backend API:

1. Update `.env`:
   ```
   VITE_API_URL=http://localhost:8000
   ```

2. Set `USE_MOCK_DATA = false` in `src/api/client.ts`

## 📊 Pages

### Login Page

- Clean, simple interface
- Email + password fields
- Redirects to dashboard on success

### Dashboard

- Grid of room cards
- Each card shows:
  - Room name
  - Temperature & humidity
  - Motion & door status
  - Fire alerts (if active)
  - **Light ON/OFF switch**
- Dark mode toggle
- Logout button

### Room Detail

- Temperature chart (last 24h)
- Humidity chart (last 24h)
- Current sensor status
- Last motion/door event times
- Light control

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Material UI v5** - Component library
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Axios** - HTTP client

## 🎯 IoT-Specific Features

### Optimistic UI

Light switches update immediately before API call completes, providing instant feedback.

### Color-Coded Status

All sensors use consistent color coding for quick status recognition.

### Critical Alerts

Fire alerts pulse and appear at the top of the dashboard for immediate attention.

### Responsive Charts

Telemetry charts automatically adjust to screen size and show 24-hour history.

## 📱 Mobile Support

- Responsive grid layout
- Touch-friendly controls
- Optimized for small screens
- Works on iOS and Android

## 🔄 API Endpoints

The app expects these backend endpoints:

- `POST /auth/login` - Authentication
- `GET /homes` - List homes
- `GET /rooms` - List rooms
- `GET /rooms/{id}/telemetry/current` - Current sensor data
- `GET /rooms/{id}/telemetry/history` - Historical data
- `POST /rooms/{id}/light/on` - Turn light on
- `POST /rooms/{id}/light/off` - Turn light off

## 🧪 Mock Data

The app includes comprehensive mock data for development:

- 4 sample rooms (Living Room, Bedroom, Kitchen, Bathroom)
- Realistic sensor values
- 24-hour telemetry history
- Fire alert simulation

## 🎨 Customization

### Theme

Edit `src/theme/theme.ts` to customize colors and typography.

### Mock Data

Edit `src/api/client.ts` to modify mock rooms and sensor values.

## 📝 License

Smart Home IoT Project
