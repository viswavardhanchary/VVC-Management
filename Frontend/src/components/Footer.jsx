import { Github, Linkedin, Code, Globe, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-blue-200/50 border-cyan-100">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="text-lg font-semibold text-cyan-900">TaskFlow</div>
            <div className="text-sm text-gray-600">Task & project management for teams</div>
          </div>
        </div>

        <div className="flex-1 md:flex-none md:ml-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">About the Author</h4>
          <p className="text-sm text-gray-600 mb-3">Built by Enjeti Viswa Vardhan Chary  Full Stack developer focused on productivity apps.</p>

          <div className="flex flex-wrap gap-2 items-center">
            <a href="https://leetcode.com/u/viswa_vardhan/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-cyan-50 text-cyan-700 rounded-lg hover:bg-cyan-100 transition text-sm">
              <Code className="w-4 h-4" /> LeetCode
            </a>

            <a href="https://www.linkedin.com/in/viswa-vardhan-chary/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>

            <a href="https://github.com/viswavardhanchary" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-50 text-gray-800 rounded-lg hover:bg-gray-100 transition text-sm">
              <Github className="w-4 h-4" /> GitHub
            </a>

            <a href="https://viswa-vardhan.onrender.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm">
              <Globe className="w-4 h-4" /> Portfolio
            </a>

            <a href="mailto:viswamakeme@gmail.com" className="flex items-center gap-2 px-3 py-2 bg-white border border-cyan-100 text-cyan-700 rounded-lg hover:bg-cyan-50 transition text-sm">
              <Mail className="w-4 h-4" /> Contact
            </a>
          </div>
        </div>

        <div className="text-sm text-gray-500">© {new Date().getFullYear()} VVC Management. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;