import React, { FC } from 'react';

const Footer: FC = () => (
  <footer className="bg-light text-center py-3 mt-4">
    <div className="container">
      <small className="text-muted">
        © {new Date().getFullYear()} MyCompany. All rights reserved.
      </small>
    </div>
  </footer>
);

export default Footer;
