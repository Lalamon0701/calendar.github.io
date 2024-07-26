class ClassCalendar {
    constructor() {
        this.events = {};
        this.currentYear = new Date().getFullYear();
        this.currentMonth = new Date().getMonth();
    }

    addEvent(date, description) {
        if (!this.events[date]) {
            this.events[date] = [];
        }
        this.events[date].push(description);
        this.saveEvents();
        this.renderCalendar();
        return `事件 '${description}' 已添加到 ${date}`;
    }

    deleteEvent(date, index) {
        if (this.events[date] && this.events[date][index]) {
            this.events[date].splice(index, 1);
            if (this.events[date].length === 0) {
                delete this.events[date];
            }
            this.saveEvents();
            this.renderCalendar();
        }
    }

    saveEvents() {
        localStorage.setItem('classCalendarEvents', JSON.stringify(this.events));
    }

    loadEvents() {
        const savedEvents = localStorage.getItem('classCalendarEvents');
        if (savedEvents) {
            this.events = JSON.parse(savedEvents);
        }
    }

    renderCalendar() {
        const calendarElement = document.getElementById('calendar');
        calendarElement.innerHTML = '';

        const date = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

        const headerElement = document.createElement('div');
        headerElement.className = 'calendar-header';
        headerElement.textContent = `${this.currentYear}年${this.currentMonth + 1}月`;
        calendarElement.appendChild(headerElement);

        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarElement.appendChild(dayElement);
        });

        for (let i = 0; i < date.getDay(); i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarElement.appendChild(emptyDay);
        }

        for (let i = 1; i <= lastDay; i++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = i;

            const currentDate = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (this.events[currentDate]) {
                this.events[currentDate].forEach((event, index) => {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'event';
                    eventElement.textContent = event;

                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'delete-button';
                    deleteButton.textContent = '刪除';
                    deleteButton.onclick = (e) => {
                        e.stopPropagation();
                        if (confirm('確定要刪除這個事件嗎？')) {
                            this.deleteEvent(currentDate, index);
                        }
                    };

                    eventElement.appendChild(deleteButton);
                    dayElement.appendChild(eventElement);
                });
            }

            calendarElement.appendChild(dayElement);
        }
    }
}

const calendar = new ClassCalendar();
calendar.loadEvents();
calendar.renderCalendar();

function addEvent() {
    const date = document.getElementById('eventDate').value;
    const description = document.getElementById('eventDescription').value;
    if (!date || !description) {
        alert('請填寫日期和事件描述');
        return;
    }
    const result = calendar.addEvent(date, description);
    alert(result);
    document.getElementById('eventDescription').value = '';
}