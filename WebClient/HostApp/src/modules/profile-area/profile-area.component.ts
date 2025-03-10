import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-profile-area',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  standalone: true,
  templateUrl: './profile-area.component.html',
  styleUrl: './profile-area.component.scss'
})
export class ProfileAreaComponent implements OnInit {
  user = {
    name: 'Oleksandr Martynin',
    email: 'alexander.petrov@example.com',
    company: 'Accenture',
    position: 'Full Stack Developer',
    position_type: 'Hybrid',
    location: 'Montreal, Canada',
    phone: '+7 (999) 123-45-67',
    avatar: 'assets/images/avatar.png',
    linkedin: 'https://www.linkedin.com/in/alexanderpetrov',
    github: 'https://github.com/alexanderpetrov',
    portfolio: '/portfolio',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Docker', 'AWS'],
    achievements: [
      { title: 'Лучший разработчик года', description: 'Награда за выдающийся вклад в 2024 году', icon: 'ri-award-line' },
      { title: 'Сертификация AWS Solutions Architect', description: 'Профессиональная сертификация AWS', icon: 'ri-medal-line' },
      { title: 'Спикер на DevOps Conference', description: 'Доклад о микросервисах', icon: 'ri-presentation-line' },
      { title: 'Руководство командой', description: 'Управление 8 разработчиками', icon: 'ri-team-line' }
    ]
  };

  constructor() {}

  ngOnInit(): void {}

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Скопировано в буфер обмена: ' + text);
    });
  }

  downloadCV() {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'CV_Александр_Петров.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
