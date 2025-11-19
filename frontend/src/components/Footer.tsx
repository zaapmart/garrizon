import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-primary">Garrizon</h3>
                        <p className="text-gray-400 text-sm">
                            Your premium destination for quality food products. We deliver freshness directly to your doorstep.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link to="/cart" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    Cart
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/faq" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/shipping" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    Shipping Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/returns" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                    Returns & Refunds
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="text-gray-400 text-sm">
                                    123 Market Street, Lagos, Nigeria
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="text-gray-400 text-sm">+234 123 456 7890</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                                <span className="text-gray-400 text-sm">support@garrizon.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Garrizon. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};
