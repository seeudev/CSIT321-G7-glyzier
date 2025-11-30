/**
 * CommunityPage Component
 * 
 * Community hub for artists and art enthusiasts on Glyzier
 * Features: Trending discussions, artist spotlights, community events, and active members
 * 
 * @author Glyzier Team
 * @version 2.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';
import styles from '../styles/pages/CommunityPage.module.css';

function CommunityPage() {
  const [activeTab, setActiveTab] = useState('discussions');

  // Mock data for discussions
  const discussions = [
    {
      id: 1,
      title: 'Best Tips for Digital Art Beginners',
      author: 'Alex Rivera',
      replies: 24,
      views: 512,
      avatar: '👩‍🎨',
      category: 'Tutorials',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      title: 'Watercolor Techniques Discussion',
      author: 'Maya Patel',
      replies: 18,
      views: 389,
      avatar: '🎨',
      category: 'Techniques',
      timestamp: '5 hours ago'
    },
    {
      id: 3,
      title: 'Selling Art Online - Revenue Share Strategies',
      author: 'Jordan Kim',
      replies: 31,
      views: 756,
      avatar: '👨‍💼',
      category: 'Business',
      timestamp: '1 day ago'
    },
    {
      id: 4,
      title: 'Community Art Challenge - November Prompt',
      author: 'Sam Chen',
      replies: 42,
      views: 1203,
      avatar: '✨',
      category: 'Challenges',
      timestamp: '3 days ago'
    },
    {
      id: 5,
      title: 'Portfolio Building for Freelance Artists',
      author: 'Zara Khan',
      replies: 15,
      views: 287,
      avatar: '🌟',
      category: 'Career',
      timestamp: '4 days ago'
    }
  ];

  // Mock data for featured artists
  const featuredArtists = [
    {
      id: 1,
      name: 'Luna Summers',
      specialty: 'Abstract Painting',
      followers: 2500,
      badge: '⭐ Featured Artist'
    },
    {
      id: 2,
      name: 'Marco Rossi',
      specialty: 'Digital Illustration',
      followers: 1850,
      badge: '🎯 Top Seller'
    },
    {
      id: 3,
      name: 'Iris Wong',
      specialty: 'Sculpture & 3D Art',
      followers: 3100,
      badge: '⭐ Featured Artist'
    },
    {
      id: 4,
      name: 'David Black',
      specialty: 'Photography & Design',
      followers: 1620,
      badge: '🔥 Rising Star'
    }
  ];

  // Mock data for community events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Weekly Digital Art Meetup',
      date: 'Dec 2, 2025',
      time: '7:00 PM UTC',
      attendees: 127,
      type: 'Virtual'
    },
    {
      id: 2,
      title: 'Artist Q&A with Luna Summers',
      date: 'Dec 5, 2025',
      time: '6:00 PM UTC',
      attendees: 89,
      type: 'Webinar'
    },
    {
      id: 3,
      title: 'Art Sale & Exhibition Preview',
      date: 'Dec 10, 2025',
      time: '3:00 PM UTC',
      attendees: 156,
      type: 'Exhibition'
    }
  ];

  return (
    <div className={styles.page}>
      <Navigation />

      {/* Header Section */}
      <header className={styles.communityHeader}>
        <div className={styles.headerContent}>
          <h1>Community Hub</h1>
          <p>Connect, Share & Grow with Glyzier Artists</p>
        </div>
      </header>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>12,500+</h3>
          <p>Active Members</p>
        </div>
        <div className={styles.statCard}>
          <h3>2,340</h3>
          <p>Discussions</p>
        </div>
        <div className={styles.statCard}>
          <h3>500+</h3>
          <p>Events Hosted</p>
        </div>
        <div className={styles.statCard}>
          <h3>98%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </section>

      <main className={styles.mainContent}>
        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'discussions' ? styles.active : ''}`}
            onClick={() => setActiveTab('discussions')}
          >
            💬 Discussions
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'artists' ? styles.active : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            🎨 Featured Artists
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'events' ? styles.active : ''}`}
            onClick={() => setActiveTab('events')}
          >
            📅 Events
          </button>
        </div>

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <section className={styles.discussionsSection}>
            <div className={styles.sectionHeader}>
              <h2>Trending Discussions</h2>
              <button className={styles.startButton}>+ Start Discussion</button>
            </div>
            <div className={styles.discussionsList}>
              {discussions.map((discussion) => (
                <div key={discussion.id} className={styles.discussionCard}>
                  <div className={styles.discussionAvatar}>{discussion.avatar}</div>
                  <div className={styles.discussionContent}>
                    <div className={styles.discussionTitle}>{discussion.title}</div>
                    <div className={styles.discussionMeta}>
                      <span className={styles.author}>by {discussion.author}</span>
                      <span className={styles.category}>{discussion.category}</span>
                      <span className={styles.timestamp}>{discussion.timestamp}</span>
                    </div>
                  </div>
                  <div className={styles.discussionStats}>
                    <div className={styles.statItem}>
                      <span className={styles.number}>{discussion.replies}</span>
                      <span className={styles.label}>Replies</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.number}>{discussion.views}</span>
                      <span className={styles.label}>Views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Artists Tab */}
        {activeTab === 'artists' && (
          <section className={styles.artistsSection}>
            <h2>Featured Artists</h2>
            <div className={styles.artistsGrid}>
              {featuredArtists.map((artist) => (
                <div key={artist.id} className={styles.artistCard}>
                  <div className={styles.artistHeader}>
                    <div className={styles.artistInitial}>{artist.name.charAt(0)}</div>
                    <span className={styles.badge}>{artist.badge}</span>
                  </div>
                  <h3>{artist.name}</h3>
                  <p className={styles.specialty}>{artist.specialty}</p>
                  <div className={styles.followers}>{artist.followers.toLocaleString()} followers</div>
                  <button className={styles.followButton}>Follow</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <section className={styles.eventsSection}>
            <h2>Upcoming Events</h2>
            <div className={styles.eventsList}>
              {upcomingEvents.map((event) => (
                <div key={event.id} className={styles.eventCard}>
                  <div className={styles.eventType}>{event.type}</div>
                  <h3>{event.title}</h3>
                  <div className={styles.eventDetails}>
                    <div className={styles.detail}>
                      <span className={styles.icon}>📅</span>
                      <span>{event.date}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.icon}>🕐</span>
                      <span>{event.time}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.icon}>👥</span>
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                  <button className={styles.registerButton}>Register Now</button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <h2>Ready to Join the Community?</h2>
        <p>Start sharing your art, connect with other creators, and grow your audience</p>
        <Link to="/" className={styles.ctaButton}>Explore Artworks</Link>
      </section>
    </div>
  );
}

export default CommunityPage;
