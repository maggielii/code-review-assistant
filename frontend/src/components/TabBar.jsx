import './TabBar.css'

const TABS = [
  { id: 'review', label: 'Review', icon: 'R' },
  { id: 'history', label: 'History', icon: 'H' },
]

function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="tabbar">
      {TABS.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${tab.id === activeTab ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <div className="tab-icon">{tab.icon}</div>
          <div className="tab-label">{tab.label}</div>
        </div>
      ))}
    </div>
  )
}

export default TabBar