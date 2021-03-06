﻿namespace TaoLa.Core
{
    public interface ICache : IStrategy
    {
        int TimeOut
        {
            get;
            set;
        }

        object Get(string key);

        void Remove(string key);

        void Insert(string key, object data);

        void Insert(string key, object data, int cacheTime);

        void Insert(string key, object data, System.DateTime cacheTime);
    }
}
