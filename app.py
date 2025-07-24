import os
import logging
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_mail import Mail, Message

# Set up logging for debugging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'huzaifakamaalkhan@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME', 'huzaifakamaalkhan@gmail.com')

mail = Mail(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        if not all([name, email, message]):
            return jsonify({'success': False, 'message': 'All fields are required'})
        
        # Create email message
        msg = Message(
            subject=f'Portfolio Contact from {name}',
            recipients=['huzaifakamaalkhan@gmail.com'],
            body=f"""
            New contact form submission:
            
            Name: {name}
            Email: {email}
            Message: {message}
            """
        )
        
        # Try to send email
        try:
            mail.send(msg)
            return jsonify({'success': True, 'message': 'Message sent successfully!'})
        except Exception as e:
            logging.error(f"Email sending failed: {e}")
            return jsonify({'success': True, 'message': 'Message received! I will get back to you soon.'})
            
    except Exception as e:
        logging.error(f"Contact form error: {e}")
        return jsonify({'success': False, 'message': 'Something went wrong. Please try again.'})

@app.route('/resume')
def resume():
    return send_from_directory('static/assets', 'resume.pdf')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
