using System;

namespace Himall.Model
{
	public class WX_MsgTemplateKey1DataModel
	{
		public WX_MSGItemBaseModel first
		{
			get;
			set;
		}

		public WX_MSGItemBaseModel keyword1
		{
			get;
			set;
		}

		public WX_MSGItemBaseModel remark
		{
			get;
			set;
		}

		public WX_MsgTemplateKey1DataModel()
		{
			this.first = new WX_MSGItemBaseModel();
			this.keyword1 = new WX_MSGItemBaseModel();
			this.remark = new WX_MSGItemBaseModel();
		}
	}
}
