import React, { useState } from 'react';
import { Home, Calendar, FileText, MessageCircle, CheckSquare, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const useChatbot = (initialMessages = [], apiKey) => {
  const [messages, setMessages] = useState(initialMessages);

  const sendMessage = async (text) => {
    setMessages([...messages, { text, sender: 'user' }]);

    try {
      const response = await fetch('https://api.groq.com/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      setMessages((msgs) => [...msgs, { text: data.response, sender: 'bot' }]);
    } catch (error) {
      setMessages((msgs) => [...msgs, { text: 'Sorry, something went wrong. Please try again later.', sender: 'bot' }]);
    }
  };

  return { messages, sendMessage };
};

const HomeScreen = ({ steps, setSteps, heartRate, setHeartRate }) => {
  const handleInputChange = (setter) => (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div className="p-6 h-full">
      <h1 className="text-3xl font-light mb-8">Fitness Dashboard</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <p className="text-lg mb-2">Daily Steps</p>
          <input 
            type="text" 
            value={steps}
            onChange={handleInputChange(setSteps)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <p className="text-lg mb-2">Avg Heart Rate</p>
          <input 
            type="text" 
            value={heartRate}
            onChange={handleInputChange(setHeartRate)}
            className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
};

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const renderCalendar = (year, month) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    const calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="text-center p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(
        <div key={day} className="text-center p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
          {day}
        </div>
      );
    }

    return calendarDays;
  };

  const changeMonth = (increment) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + increment);
      return newDate;
    });
  };

  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-light">Fitness Calendar</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => changeMonth(-1)} className="text-gray-600 hover:text-gray-800"><ChevronLeft size={24} /></button>
          <span className="text-lg">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => changeMonth(1)} className="text-gray-600 hover:text-gray-800"><ChevronRight size={24} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => (
          <div key={day} className="text-center font-medium text-gray-600">{day}</div>
        ))}
        {renderCalendar(currentDate.getFullYear(), currentDate.getMonth())}
      </div>
    </div>
  );
};

const NotesScreen = ({ notes, setNotes }) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-light mb-6">Fitness Notes</h1>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your fitness notes here..."
        className="flex-1 bg-gray-100 border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

const TasksScreen = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-light mb-6">Fitness Tasks</h1>
      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 bg-white border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600">
          <Plus size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-auto space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center bg-gray-100 p-3 rounded-md">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
              className="mr-3"
            />
            <span className={`flex-1 ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</span>
            <button onClick={() => removeTask(task.id)} className="text-gray-500 hover:text-red-500">
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChatbotScreen = ({ messages, sendMessage }) => {
  const [input, setInput] = useState('');

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-light mb-6">Fitness AI Chat</h1>
      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-3/4 p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your fitness AI..."
          className="flex-1 bg-white border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            sendMessage(input);
            setInput('');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [steps, setSteps] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');
  const [tasks, setTasks] = useState([]);
  const { messages, sendMessage } = useChatbot([], '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');
  
  const [activeScreen, setActiveScreen] = useState('home');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'home':
        return <HomeScreen steps={steps} setSteps={setSteps} heartRate={heartRate} setHeartRate={setHeartRate} />;
      case 'calendar':
        return <CalendarScreen />;
      case 'notes':
        return <NotesScreen notes={notes} setNotes={setNotes} />;
      case 'tasks':
        return <TasksScreen tasks={tasks} setTasks={setTasks} />;
      case 'chatbot':
        return <ChatbotScreen messages={messages} sendMessage={sendMessage} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-shrink-0 bg-blue-600 text-white p-4">
        <h1 className="text-xl font-semibold">Fitness App</h1>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <nav className="w-20 bg-gray-800 text-gray-100 flex flex-col items-center p-4 space-y-6">
          <button onClick={() => setActiveScreen('home')}><Home size={24} /></button>
          <button onClick={() => setActiveScreen('calendar')}><Calendar size={24} /></button>
          <button onClick={() => setActiveScreen('notes')}><FileText size={24} /></button>
          <button onClick={() => setActiveScreen('tasks')}><CheckSquare size={24} /></button>
          <button onClick={() => setActiveScreen('chatbot')}><MessageCircle size={24} /></button>
        </nav>
        <main className="flex-1 overflow-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
};

export default App;
