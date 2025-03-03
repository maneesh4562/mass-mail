import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [validEmails, setValidEmails] = useState([]);
    const [invalidEmails, setInvalidEmails] = useState([]);
    const [from, setFrom] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [sending, setSending] = useState(false);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);

        try {
            const response = await axios.post('https://mass-mail-backend.onrender.com/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setValidEmails(response.data.validEmails);
            setInvalidEmails(response.data.invalidEmails);
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSendEmails = async () => {
        setSending(true);
        if (validEmails.length === 0) {
          alert('No valid emails to send.');
          setSending(false);
          return;
      }

        try {
               await axios.post('https://mass-mail-backend.onrender.com/api/send-emails', {
                from,
                subject,
                message,
                emails: validEmails
            })
            alert('Emails sent successfully ,Task completed! Happy ending');
        } catch (error) {
            console.error('Error sending emails:', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="container">
            <h1>Mass Mail Dispatcher</h1>

            <div className="upload-section">
                <h2>Upload CSV File</h2>
                <input type="file" onChange={handleFileUpload} accept='.csv'/>
                {uploading && <p>Uploading...</p>}
            </div>

            <div className="form-section">
                <h2>Compose Your Email</h2>
                <input 
                    type="email" 
                    id="from" 
                    name="from" 
                    placeholder="From" 
                    value={from} 
                    onChange={(e) => setFrom(e.target.value)} 
                />
                <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    placeholder="Subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                />
                <textarea 
                    id="message" 
                    name="message" 
                    placeholder="Message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                />
                <button 
                    onClick={handleSendEmails} 
                    disabled={sending || validEmails.length === 0}
                >
                    {sending ? 'Sending...' : 'Send Emails'}
                </button>
            </div>

            <div className="tables">
                <div className="table-container">
                    <h2>Valid Emails:-{" "}{validEmails.length}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {validEmails.map((email, index) => (
                                <tr key={index}>
                                    <td>{email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-container">
                    <h2>Invalid Emails:-{" "}{invalidEmails.length}</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invalidEmails.map((email, index) => (
                                <tr key={index}>
                                    <td>{email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default App;
