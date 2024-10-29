import React from 'react'

interface RightSidebarProps {
    user: {
        first_name: string;
        last_name: string;
    };
}

const RightSidebar = ({ user }: RightSidebarProps) => {
  
    return (
        <aside className='right-sidebar'>
            <section className='flex flex-col pb8'>
                <div className='profile-banner'>
                    <div className='profile'>
                        <div className='profile-img'>
                            <span className='text-5xl font-bold text-blue-500'>{user.first_name}</span>
                        </div>
                        <div className='profile-details'>
                            <h1 className='profile-name'>
                                {user.first_name} {user.last_name}
                            </h1>
                        </div>
                    </div>
                </div>
            </section>
        </aside>
    )
}

export default RightSidebar;
