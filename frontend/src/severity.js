const SEVERITY_STYLES = {
    error: { cls: 'error', icon: '!' },
    warning: { cls: 'warning', icon: '!' },
    style: { cls: 'info', icon: 'i' },
    info: { cls: 'info', icon: 'i' },
    suggestion: { cls: 'suggestion', icon: '→' },
  }
  
  export function getSeverityStyle(severity) {
    return SEVERITY_STYLES[String(severity).toLowerCase()] || SEVERITY_STYLES.info
  }