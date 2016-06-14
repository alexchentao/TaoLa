﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TaoLa.Web.Areas.Admin.Models
{
    public class ManagerInfoModel
    {
        public string Password
        {
            get;
            set;
        }

        public string RealName
        {
            get;
            set;
        }

        public string Remark
        {
            get;
            set;
        }

        public long RoleId
        {
            get;
            set;
        }

        public string UserName
        {
            get;
            set;
        }

        public ManagerInfoModel()
        {
        }
    }
}