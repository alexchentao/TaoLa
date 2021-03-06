using Quartz;
using System;
using System.Collections.Generic;

namespace TaoLa.Core
{
	public class QuartzJob : IJob
	{
		public void Execute(IJobExecutionContext context)
		{
			Dictionary<string, object> obj = context.JobDetail.JobDataMap["dataMap"] as Dictionary<string, object>;
			string key = context.JobDetail.JobDataMap["jobName"] as string;
			Dictionary<string, QuartzKey> dictionary = context.JobDetail.JobDataMap["quartzCache"] as Dictionary<string, QuartzKey>;
			try
			{
				(context.JobDetail.JobDataMap["action"] as System.Action<Dictionary<string, object>>)(obj);
				if (dictionary.ContainsKey(key))
				{
					dictionary[key].Logs.Add(System.DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + " 任务执行成功。");
				}
			}
			catch (System.Exception ex)
			{
				if (dictionary.ContainsKey(key))
				{
					dictionary[key].Logs.Add(ex.Message);
				}
			}
		}
	}
}
