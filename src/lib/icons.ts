export const iconOptions = [
  // Home & Family
  { value: 'home_rounded', label: '🏠 Home', category: 'Home' },
  { value: 'family_rounded', label: '👨‍👩‍👧‍👦 Family', category: 'Home' },
  { value: 'baby_rounded', label: '👶 Baby', category: 'Home' },
  { value: 'pets_rounded', label: '🐕 Pets', category: 'Home' },
  { value: 'garden_rounded', label: '🌻 Garden', category: 'Home' },
  
  // Work & Business
  { value: 'work_rounded', label: '💼 Work', category: 'Work' },
  { value: 'business_rounded', label: '🏢 Business', category: 'Work' },
  { value: 'meeting_rounded', label: '🤝 Meeting', category: 'Work' },
  { value: 'chart_rounded', label: '📊 Chart', category: 'Work' },
  { value: 'money_rounded', label: '💰 Money', category: 'Work' },
  
  // Education
  { value: 'school_rounded', label: '🎓 School', category: 'Education' },
  { value: 'book_rounded', label: '📚 Book', category: 'Education' },
  { value: 'science_rounded', label: '🔬 Science', category: 'Education' },
  { value: 'math_rounded', label: '🔢 Math', category: 'Education' },
  { value: 'history_rounded', label: '🏛️ History', category: 'Education' },
  
  // Technology
  { value: 'computer_rounded', label: '💻 Computer', category: 'Technology' },
  { value: 'phone_rounded', label: '📱 Phone', category: 'Technology' },
  { value: 'camera_rounded', label: '📷 Camera', category: 'Technology' },
  { value: 'videogame_rounded', label: '🎮 Gaming', category: 'Technology' },
  { value: 'robot_rounded', label: '🤖 Robot', category: 'Technology' },
  
  // Travel & Transport
  { value: 'flight_rounded', label: '✈️ Flight', category: 'Travel' },
  { value: 'car_rounded', label: '🚗 Car', category: 'Travel' },
  { value: 'train_rounded', label: '🚂 Train', category: 'Travel' },
  { value: 'ship_rounded', label: '🚢 Ship', category: 'Travel' },
  { value: 'map_rounded', label: '🗺️ Map', category: 'Travel' },
  
  // Food & Dining
  { value: 'restaurant_rounded', label: '🍽️ Restaurant', category: 'Food' },
  { value: 'coffee_rounded', label: '☕ Coffee', category: 'Food' },
  { value: 'pizza_rounded', label: '🍕 Pizza', category: 'Food' },
  { value: 'fruit_rounded', label: '🍎 Fruit', category: 'Food' },
  { value: 'cooking_rounded', label: '👨‍🍳 Cooking', category: 'Food' },
  
  // Sports & Activities
  { value: 'sports_soccer_rounded', label: '⚽ Soccer', category: 'Sports' },
  { value: 'basketball_rounded', label: '🏀 Basketball', category: 'Sports' },
  { value: 'tennis_rounded', label: '🎾 Tennis', category: 'Sports' },
  { value: 'swimming_rounded', label: '🏊 Swimming', category: 'Sports' },
  { value: 'fitness_rounded', label: '💪 Fitness', category: 'Sports' },
  
  // Health & Medical
  { value: 'local_hospital_rounded', label: '🏥 Hospital', category: 'Health' },
  { value: 'medicine_rounded', label: '💊 Medicine', category: 'Health' },
  { value: 'heart_rounded', label: '❤️ Heart', category: 'Health' },
  { value: 'wellness_rounded', label: '🧘 Wellness', category: 'Health' },
  { value: 'emergency_rounded', label: '🚑 Emergency', category: 'Health' },
  
  // Entertainment & Arts
  { value: 'palette_rounded', label: '🎨 Art', category: 'Entertainment' },
  { value: 'music_rounded', label: '🎵 Music', category: 'Entertainment' },
  { value: 'movie_rounded', label: '🎬 Movie', category: 'Entertainment' },
  { value: 'theater_rounded', label: '🎭 Theater', category: 'Entertainment' },
  { value: 'dance_rounded', label: '💃 Dance', category: 'Entertainment' },
  
  // Shopping
  { value: 'shopping_bag_rounded', label: '🛍️ Shopping', category: 'Shopping' },
  { value: 'store_rounded', label: '🏪 Store', category: 'Shopping' },
  { value: 'cart_rounded', label: '🛒 Cart', category: 'Shopping' },
  { value: 'payment_rounded', label: '💳 Payment', category: 'Shopping' },
  { value: 'sale_rounded', label: '🏷️ Sale', category: 'Shopping' },
  
  // Nature & Weather
  { value: 'nature_rounded', label: '🌳 Nature', category: 'Nature' },
  { value: 'beach_rounded', label: '🏖️ Beach', category: 'Nature' },
  { value: 'mountain_rounded', label: '⛰️ Mountain', category: 'Nature' },
  { value: 'weather_rounded', label: '☀️ Weather', category: 'Nature' },
  { value: 'rain_rounded', label: '🌧️ Rain', category: 'Nature' },
  
  // Communication
  { value: 'chat_rounded', label: '💬 Chat', category: 'Communication' },
  { value: 'email_rounded', label: '📧 Email', category: 'Communication' },
  { value: 'language_rounded', label: '🗣️ Language', category: 'Communication' },
  { value: 'translate_rounded', label: '🈯 Translate', category: 'Communication' },
  { value: 'social_rounded', label: '👥 Social', category: 'Communication' },
  
  // Time & Calendar
  { value: 'calendar_rounded', label: '📅 Calendar', category: 'Time' },
  { value: 'clock_rounded', label: '🕐 Clock', category: 'Time' },
  { value: 'alarm_rounded', label: '⏰ Alarm', category: 'Time' },
  { value: 'schedule_rounded', label: '📋 Schedule', category: 'Time' },
  { value: 'deadline_rounded', label: '⏳ Deadline', category: 'Time' },
  
  // Tools & Utilities
  { value: 'settings_rounded', label: '⚙️ Settings', category: 'Tools' },
  { value: 'tools_rounded', label: '🔧 Tools', category: 'Tools' },
  { value: 'construction_rounded', label: '🚧 Construction', category: 'Tools' },
  { value: 'flashlight_rounded', label: '🔦 Flashlight', category: 'Tools' },
  { value: 'battery_rounded', label: '🔋 Battery', category: 'Tools' }
];

// Get icon emoji by value
export const getIconEmoji = (value: string): string => {
  const icon = iconOptions.find(opt => opt.value === value);
  return icon ? icon.label.split(' ')[0] : '❓';
};

// Get grouped icons by category
export const getIconsByCategory = () => {
  const grouped: { [key: string]: typeof iconOptions } = {};
  
  iconOptions.forEach(icon => {
    if (!grouped[icon.category]) {
      grouped[icon.category] = [];
    }
    grouped[icon.category].push(icon);
  });
  
  return grouped;
};