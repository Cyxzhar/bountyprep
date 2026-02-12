import React from 'react';
import { Shield, Layers, Target, BookOpen, FlaskConical, Crown } from 'lucide-react';

const BrowserFrame = ({ currentAttack, children, modal }) => {
    return (
        <div className="reveal-glass">
            {/* Browser Header */}
            <div className="reveal-header">
                <div className="header-controls">
                    <div className="dot red"></div>
                    <div className="dot yellow"></div>
                    <div className="dot green"></div>
                </div>
                <div className="header-address-bar">
                    <Shield size={12} className="lock-icon" />
                    <span className="protocol">https://</span>
                    <span className="domain">{currentAttack.url.split('/')[0]}</span>
                    <span className="path">/{currentAttack.url.split('/').slice(1).join('/')}</span>
                </div>
            </div>

            <div className="reveal-body">
                <div className="reveal-app-layout">
                    {/* Sidebar */}
                    <div className="reveal-sidebar">
                        <div className="sidebar-group">
                            <div className="sidebar-icon active" title="Explorer"><Layers size={22} /></div>
                            <div className="sidebar-icon" title="Search"><Target size={22} /></div>
                            <div className="sidebar-icon" title="Source Control"><BookOpen size={22} /></div>
                        </div>
                        <div className="sidebar-group bottom">
                            <div className="sidebar-icon" title="Extensions"><FlaskConical size={22} /></div>
                            <div className="sidebar-icon" title="Profile"><Crown size={22} /></div>
                        </div>
                    </div>

                    <div className="reveal-main">
                        {children}
                    </div>
                </div>
                {modal}
            </div>
        </div>
    );
};

export default BrowserFrame;
