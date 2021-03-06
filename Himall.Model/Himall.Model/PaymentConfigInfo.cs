using System;

namespace Himall.Model
{
	public class PaymentConfigInfo : BaseModel
	{
		private long _id;

		public new long Id
		{
			get
			{
				return this._id;
			}
			set
			{
				this._id = value;
				base.Id = value;
			}
		}

		public bool IsCashOnDelivery
		{
			get;
			set;
		}
	}
}
