const Notification = ({ notification }) => {
  if (!notification) {
    return null;
  }

  const notificationStyle = {
    color: notification.type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  return <div style={notificationStyle}>{notification.message}</div>;
};

export default Notification;
